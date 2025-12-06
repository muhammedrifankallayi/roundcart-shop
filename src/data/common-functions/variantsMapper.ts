import { Variant } from "../models/variants.model";

export  function formatInventory(inventories:Variant[]) {
    const result = {};

    for (const inv of inventories) {
        const sizeName = inv.size?.code || "UNKNOWN";
        const colorName = inv.color?.name || "UNKNOWN";

        if (!result[sizeName]) {
            result[sizeName] = {
                size: sizeName,
                inventoryId: inv._id || "UNKNOWN",
                totalStock: 0,
                colors: {}
            };
        }

        // Add stock to size total
        result[sizeName].totalStock += inv.stock;
 

        // Add stock to this color under this size
        if (!result[sizeName].colors[colorName]) {
            result[sizeName].colors[colorName] = 0;

        }

        result[sizeName].colors[colorName] += inv.stock;
    }

    // Convert colors object → array
    return Object.values(result).map((sizeEntry:any) => ({
        size: sizeEntry.size,
        totalStock: sizeEntry.totalStock,
        inventoryId: sizeEntry.inventoryId,
        colors: Object.entries(sizeEntry.colors).map(([colorName, stock]) => {
            const colorData = inventories.find(inv => inv.color?.name === colorName)?.color;
            return {
                colorName,
                hex: colorData?.hex,
                rgb: colorData?.rgb,
                totalStock: stock,
                inventoryId: sizeEntry.inventoryId
            };
        })
    })) as InventoryFormatted[];
}



export function formatInventoryRecord(inventories: Variant[]) {
  const result: Record<string, InventoryFormattedRecord> = {};

  for (const inv of inventories) {
    const size_id = inv.size?._id || "UNKNOWN";
    const color_id = inv.color?._id || "UNKNOWN";

    if (!result[size_id]) {
      result[size_id] = {
        size: inv.size?.code || "UNKNOWN",
        totalStock: 0,
        inventoryId: inv._id || "UNKNOWN",
        colors: {}
      };
    }

    // Add stock for size total
    result[size_id].totalStock += inv.stock;

    // If this color doesn't exist yet — initialize
    if (!result[size_id].colors[color_id]) {
      const color = inv.color;
      result[size_id].colors[color_id] = {
        colorName: color?.name || "UNKNOWN",
        hex: color?.hex,
        rgb: color?.rgb,
        totalStock: 0,
        inventoryId: inv._id || "UNKNOWN"
      };
    }

    // Add stock to color
    result[size_id].colors[color_id].totalStock += inv.stock;
  }

  return result as InventoryFormattedRecordMap;
}


export interface InventoryFormatted {
  size: string;
  totalStock: number;
  inventoryId?: string; 
  colors: InventoryColorFormatted[];
}
export interface InventoryColorFormatted {
  colorName: string;
  hex?: string;
  rgb?: string;
  totalStock: number;
  inventoryId?: string;
}



export interface InventoryFormattedRecord {
  size: string;
  totalStock: number;
  inventoryId: string;
  colors: Record<
    string, // colorName
    {
      colorName: string;
      hex?: string;
      rgb?: string;
      totalStock: number;
      inventoryId: string;
    }
  >;
}

export type InventoryFormattedRecordMap = Record<string, InventoryFormattedRecord>;
