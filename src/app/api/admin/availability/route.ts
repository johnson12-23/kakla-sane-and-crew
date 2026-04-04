import { NextRequest, NextResponse } from "next/server";
import { getAvailability, setConfiguredTotalCapacity } from "@/lib/booking-store";
import { isAdminLoggedIn } from "@/lib/admin-auth";

function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  if (!isAdminLoggedIn()) {
    return unauthorized();
  }

  try {
    const availability = await getAvailability();
    return NextResponse.json(availability);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to load availability." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAdminLoggedIn()) {
    return unauthorized();
  }

  try {
    const body = await request.json();
    const totalCapacity = Number(body?.totalCapacity);

    if (!Number.isFinite(totalCapacity) || totalCapacity < 1) {
      return NextResponse.json({ message: "Invalid capacity value." }, { status: 400 });
    }

    const updatedCapacity = await setConfiguredTotalCapacity(totalCapacity);
    const availability = await getAvailability();

    return NextResponse.json({
      totalCapacity: updatedCapacity,
      sold: availability.sold,
      available: availability.available
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to update availability." },
      { status: 500 }
    );
  }
}
