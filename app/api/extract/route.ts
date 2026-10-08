import { NextResponse } from "next/server";

import { extractLabelFromImage } from "@/library/gemini";
import { validateExtraction } from "@/library/validate";


export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const image = formData.get("image");
    const selectedCrop = formData.get("selectedCrop");

    if (!(image instanceof File)) {
      return NextResponse.json(
        {
          status: "error",
          message: "No image provided.",
        },
        { status: 400 }
      );
    }

    if (typeof selectedCrop !== "string") {
      return NextResponse.json(
        {
          status: "error",
          message: "No crop selected.",
        },
        { status: 400 }
      );
    }


    const buffer = Buffer.from(
      await image.arrayBuffer()
    );

    const imageBase64 = buffer.toString("base64");


    const extraction = await extractLabelFromImage(
      imageBase64,
      image.type
    );


    const validation = validateExtraction(
      extraction,
      selectedCrop
    );


    if (validation.status === "ok") {
      return NextResponse.json({
        status: "ok",
        label: extraction,
        entry: validation.entry,
      });
    }


    if (validation.status === "crop_not_labeled") {
      return NextResponse.json({
        status: "crop_not_labeled",
        label: extraction,
      });
    }


    return NextResponse.json({
      status: "cant_read",
      reason: validation.reason,
    });


  } catch (error) {
    console.error("Extraction error:", error);

    return NextResponse.json(
      {
        status: "error",
        message:
          "Could not read the label. Please try again.",
      },
      { status: 500 }
    );
  }
}