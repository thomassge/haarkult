import { getPublicAvailableSlots, PublicSlotQueryError } from "@/lib/booking/public-queries";
import { slotQuerySchema } from "@/lib/booking/public-validation";

const publicError = { error: "Ungueltige Anfrage." };

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const parsed = slotQuerySchema.safeParse({
    serviceId: searchParams.get("serviceId"),
    date: searchParams.get("date"),
    staffId: searchParams.get("staffId") ?? undefined,
  });

  if (!parsed.success) {
    return Response.json(publicError, { status: 400 });
  }

  try {
    const slots = await getPublicAvailableSlots(parsed.data);

    return Response.json({ slots });
  } catch (error) {
    if (error instanceof PublicSlotQueryError) {
      return Response.json(publicError, { status: 400 });
    }

    throw error;
  }
}
