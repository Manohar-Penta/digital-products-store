import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInPaisa: true },
    _count: true,
  });

  return {
    amount: (data._sum.pricePaidInPaisa || 0) / 100,
    numberOfSales: data._count,
  };
}

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({ _sum: { pricePaidInPaisa: true } }),
  ]);
  return {
    userCount,
    averageValuePerUser:
      userCount === 0 ? 0 : (orderData._sum.pricePaidInPaisa || 0) / userCount,
  };
}

async function getProductsData() {
  const [activeProducts, inactiveProducts] = await Promise.all([
    db.product.count({ where: { isAvailable: true } }),
    db.product.count({ where: { isAvailable: false } }),
  ]);

  return { activeProducts, inactiveProducts };
}

export default async function Page() {
  const [salesData, userData, productsData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductsData(),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle={formatNumber(salesData.numberOfSales)}
        body={formatCurrency(salesData.amount)}
      />
      <DashboardCard
        title="Customers"
        subtitle={
          formatCurrency(userData.averageValuePerUser) + " Average Value"
        }
        body={formatNumber(userData.userCount)}
      />
      <DashboardCard
        title="Active Products"
        subtitle={
          formatNumber(productsData.inactiveProducts) + " Inactive Products"
        }
        body={formatNumber(productsData.activeProducts)}
      />
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  subtitle: string;
  body: string;
}

export function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>{body}</CardContent>
    </Card>
  );
}
