import { paperClasses } from "@mui/material/Paper";
import { alpha, type Theme } from "@mui/material/styles";
import type { GridClassKey } from "@mui/x-data-grid";
import { menuItemClasses } from "@mui/material/MenuItem";
import { listItemIconClasses } from "@mui/material/ListItemIcon";
import { iconButtonClasses } from "@mui/material/IconButton";
import { checkboxClasses } from "@mui/material/Checkbox";
import { listClasses } from "@mui/material/List";
import { gridClasses } from "@mui/x-data-grid";
import { tablePaginationClasses } from "@mui/material/TablePagination";
import { gray } from "../../theme/themePrimitives";

/* eslint-disable import/prefer-default-export */
export const dataGridCustomizations: {
  MuiDataGrid: {
    styleOverrides: Partial<Record<GridClassKey, any>>;
  };
} = {
  MuiDataGrid: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        "--DataGrid-overlayHeight": "300px",
        overflow: "clip",
        padding: theme.spacing(2),
        borderColor: (theme.vars || theme).palette.divider,
        //backgroundColor: (theme.vars || theme).palette.background.default,
        backgroundColor: "#fff",
        [`& .${gridClasses.columnHeader}`]: {
          // backgroundColor: (theme.vars || theme).palette.background.default,
          backgroundColor: "#fff",
          [`& .${gridClasses.columnHeaderTitle}`]: {
            fontWeight: "bold"
          }
        },
        [`& .${gridClasses.footerContainer}`]: {
          //backgroundColor: (theme.vars || theme).palette.background.paper
          backgroundColor: "#fff"
        }
      })
    }
  }
};
