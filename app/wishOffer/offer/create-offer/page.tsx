import { CreateWishOfferForm } from "@/components/sections/create-wish/create-wish-form";

export default function CreateWishPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Create a Wish</h1>
        <CreateWishOfferForm is_wish_or_offer="offers" />
      </div>
    </div>
  );
}
