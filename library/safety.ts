import bannedData from "@/data/banned.json";

type BannedEntry = {
  id: string;
  active_ingredient: string;
  aliases: string[];
  status: "banned" | "restricted" | "VERIFY";
  note: string;
};

type VerifiedBannedEntry = Omit<BannedEntry, "status"> & {
  status: "banned" | "restricted";
};

type SafetyResult =
  | {
      status: "safe";
    }
  | {
      status: "banned" | "restricted";
      entry: VerifiedBannedEntry;
    };

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

export function checkBannedIngredient(
  activeIngredient: string
): SafetyResult {
  const extracted = normalize(activeIngredient);

  const entry = bannedData.entries.find((item) => {
    if (
      item.status !== "banned" &&
      item.status !== "restricted"
    ) {
      return false;
    }

    const names = [
      item.active_ingredient,
      ...item.aliases,
    ];

    return names.some((name) =>
      extracted.includes(normalize(name))
    );
  });

  if (!entry) {
    return {
      status: "safe",
    };
  }

  return {
    status: entry.status as "banned" | "restricted",
    entry: {
      ...entry,
      status: entry.status as "banned" | "restricted",
    },
  };
}