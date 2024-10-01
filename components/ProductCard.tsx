import { formatCurrency } from "@/lib/formatters";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

type ProductProps = {
  id: string;
  name: string;
  priceInPaisa: number;
  description: string;
  imagePath: string;
};

export function ProductCard({
  id,
  name,
  priceInPaisa,
  description,
  imagePath,
}: ProductProps) {
  return (
    <Card>
      <div className="relative w-full h-auto aspect-video">
        <Image src={imagePath} alt={name} fill />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{formatCurrency(priceInPaisa / 100)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" size={"lg"}>
          <Link href={`/products/${id}/purchase`}>Purchase</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ProductCardSekeleton() {
  return (
    <Card className="overflow-hidden animate-pulse flex flex-col">
      <div className="w-full aspect-video bg-gray-300"></div>
      <CardHeader>
        <CardTitle>
          <div className="w-3/4 h-6 rounded-full bg-gray-300"></div>
        </CardTitle>
        {/* <CardDescription> */}
        <div className="w-1/2 h-4 rounded-full bg-gray-300"></div>
        {/* </CardDescription> */}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full h-4 rounded-full bg-gray-300"></div>
        <div className="w-full h-4 rounded-full bg-gray-300"></div>
        <div className="w-3/4 h-4 rounded-full bg-gray-300"></div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" size={"lg"} disabled>
          <div className="w-full h-8 rounded-full bg-gray-600"></div>
        </Button>
      </CardFooter>
    </Card>
  );
}
