import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SK as string);

export default async function page({
  searchParams,
}: {
  searchParams: {
    payment_intent: string;
    payment_intent_client_secret: string;
  };
}) {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  );

  if (paymentIntent.metadata.productId == null) return notFound();

  const isSuccess = paymentIntent.status === "succeeded";

  const product = await db.product.findFirst({
    where: { id: paymentIntent.metadata.id },
  });
  if (product == null) return notFound();

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <h1 className="text-4xl font-bold">
        {isSuccess ? "success!!" : "Error!"}
      </h1>
      <div className="flex items-center gap-4">
        <div className="aspect-video flex-shrink-0 w-1/3 relative">
          <Image
            src={product.imagePath}
            alt={product.description}
            fill
            className="object-cover"
          />
        </div>
        <div className="mx-4">
          <div className="text-lg">
            {formatCurrency(product.priceInPaisa / 100)}
          </div>
          <h1 className="text-2xl bold">{product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
          <Button className="mt-4" size="lg" asChild>
            {isSuccess ? (
              <a
                href={`/products/download/${await createDownloadVerification(
                  product.id
                )}`}
              >
                Download
              </a>
            ) : (
              <Link href={`/${product.id}/purchase`}>Try Again..</Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

async function createDownloadVerification(productId: string) {
  return (
    await db.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })
  ).id;
}
