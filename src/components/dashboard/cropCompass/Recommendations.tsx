"use client";
import * as React from "react";
import { Box, Typography, Grid, Card, useMediaQuery, useTheme, Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableContainer, TableRow, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CustomizedDataGrid from "@/components/shared/CustomizedDataGrid";
import MoonPhaseDisplay from "./LunarPhase";
import CropCompassGauge from "./CropCompassGauge";
import SuddenWhiltGauge from "./SuddenWhiltGauge";
import { Moon } from "lunarphase-js";
import moment from "moment";
import { getCropCompassResult, getWhiltRisk } from "./utils";
// Create the fertilizer data with detailed nutrient information
const fertilizerColumns = [
  { field: 'name', headerName: 'Fertilizer', flex: 2 ,sortable: false},
  { field: 'rate', headerName: 'Rate (Kg/ha)', flex: 1.2 ,sortable: false},
  { field: 'appTime', headerName: 'App Time', flex: 1 ,sortable: false},
  { field: 'appMethod', headerName: 'App Method', flex: 1.2 ,sortable: false},
  { field: 'N', headerName: 'N', flex: 0.7 ,sortable: false},
  { field: 'P', headerName: 'P', flex: 0.7 ,sortable: false},
  { field: 'K', headerName: 'K', flex: 0.7 ,sortable: false},
  { field: 'S', headerName: 'S', flex: 0.7 ,sortable: false},
  { field: 'Ca', headerName: 'Ca', flex: 0.7 ,sortable: false},
  { field: 'Mg', headerName: 'Mg', flex: 0.7 ,sortable: false},
  { field: 'Zn', headerName: 'Zn', flex: 0.7 ,sortable: false},
  { field: 'B', headerName: 'B', flex: 0.7 ,sortable: false},
  { field: 'Fe', headerName: 'Fe', flex: 0.7 ,sortable: false},
  { field: 'Cu', headerName: 'Cu', flex: 0.7 ,sortable: false},
  { field: 'Mn', headerName: 'Mn', flex: 0.7 ,sortable: false},
  { field: 'Mo', headerName: 'Mo', flex: 0.7 ,sortable: false},
  { field: 'Co', headerName: 'Co', flex: 0.7 ,sortable: false},
];

const mobileFertilizerColumns = [
  { field: 'name', headerName: 'Fertilizer', flex: 2 ,sortable: false},
];

const fertilizerRows = [
  { 
    id: 1, 
    name: 'Nu Edge Nu-Injecta Cal N+Fulvic+Boron', 
    rate: 50, 
    appTime: 'Mix 1', 
    appMethod: 'Fertigation',
    N: 5.25,
    P: '',
    K: '',
    S: '',
    Ca: 7.5,
    Mg: '',
    Zn: '',
    B: 0.1785,
    Fe: '',
    Cu: '',
    Mn: '',
    Mo: '',
    Co: ''
  },
  { 
    id: 2, 
    name: 'Nu Edge Nu-Injecta Cal-Peak', 
    rate: 10, 
    appTime: 'Mix 1', 
    appMethod: 'Fertigation',
    N: 0.1,
    P: '',
    K: '',
    S: '',
    Ca: 0.62,
    Mg: '',
    Zn: '',
    B: '',
    Fe: '',
    Cu: '',
    Mn: '',
    Mo: '',
    Co: ''
  },
  { 
    id: 3, 
    name: 'Nu Edge Nu-Injecta UAN', 
    rate: 70, 
    appTime: 'Mix 1', 
    appMethod: 'Fertigation',
    N: 29.4,
    P: '',
    K: '',
    S: '',
    Ca: '',
    Mg: '',
    Zn: '',
    B: '',
    Fe: '',
    Cu: '',
    Mn: '',
    Mo: '',
    Co: ''
  },
  { 
    id: 4, 
    name: 'IPF Solubor', 
    rate: 1, 
    appTime: 'Mix 1', 
    appMethod: 'Fertigation',
    N: '',
    P: '',
    K: '',
    S: '',
    Ca: '',
    Mg: '',
    Zn: '',
    B: 0.205,
    Fe: '',
    Cu: '',
    Mn: '',
    Mo: '',
    Co: ''
  },
  { 
    id: 5, 
    name: 'Renovum Aequor', 
    rate: 2, 
    appTime: 'Mix 3', 
    appMethod: 'Foliar',
    N: '',
    P: '',
    K: '',
    S: '',
    Ca: '',
    Mg: '',
    Zn: '',
    B: '',
    Fe: '',
    Cu: '',
    Mn: '',
    Mo: '',
    Co: ''
  },
  { 
    id: 6, 
    name: 'Nu Edge Nu-Trace Quad + Mo', 
    rate: 2, 
    appTime: 'Mix 3', 
    appMethod: 'Foliar',
    N: 0.148,
    P: '',
    K: '',
    S: 0.048,
    Ca: '',
    Mg: '',
    Zn: 0.036,
    B: '',
    Fe: 0.03,
    Cu: 0.024,
    Mn: 0.032,
    Mo: 0.002,
    Co: ''
  },
  { 
    id: 7, 
    name: 'Magnesium Sulphate', 
    rate: 30, 
    appTime: 'Mix 2', 
    appMethod: 'Fertigation',
    N: '',
    P: '',
    K: '',
    S: 3.72,
    Ca: '',
    Mg: 2.88,
    Zn: '',
    B: '',
    Fe: '',
    Cu: '',
    Mn: '',
    Mo: '',
    Co: ''
  },
  { 
    id: 8, 
    name: 'Potassium Nitrate', 
    rate: 25, 
    appTime: 'Mix 2', 
    appMethod: 'Fertigation',
    N: 3.3,
    P: '',
    K: 9.55,
    S: '',
    Ca: '',
    Mg: '',
    Zn: '',
    B: '',
    Fe: '',
    Cu: '',
    Mn: '',
    Mo: '',
    Co: ''
  },
  { 
    id: 9, 
    name: 'IPF Solubor', 
    rate: 1, 
    appTime: 'Mix 2', 
    appMethod: 'Fertigation',
    N: '',
    P: '',
    K: '',
    S: '',
    Ca: '',
    Mg: '',
    Zn: '',
    B: 0.205,
    Fe: '',
    Cu: '',
    Mn: '',
    Mo: '',
    Co: ''
  },
  { 
    id: 10, 
    name: 'Nu Edge Nu-Trace Quad + Mo', 
    rate: 25, 
    appTime: 'Mix 2', 
    appMethod: 'Fertigation',
    N: 1.85,
    P: '',
    K: '',
    S: 0.6,
    Ca: '',
    Mg: '',
    Zn: 0.45,
    B: '',
    Fe: 0.375,
    Cu: 0.3,
    Mn: 0.4,
    Mo: 0.025,
    Co: ''
  },
  { 
    id: 11, 
    name: 'Total', 
    rate: '', 
    appTime: '', 
    appMethod: '',
    N: 40.05,
    P: '',
    K: 9.55,
    S: 4.37,
    Ca: 8.12,
    Mg: 2.88,
    Zn: 0.49,
    B: 0.59,
    Fe: 0.41,
    Cu: 0.32,
    Mn: 0.432,
    Mo: 0.027,
    Co: ''
  },
];

interface RecommendationsProps {
  onReset: () => void;
  netChargeBalance: number;
  whiltRisk: number;
  isDryTissue: boolean;
}

export default function Recommendations({ onReset, netChargeBalance, whiltRisk, isDryTissue }: RecommendationsProps): React.ReactElement {
  const [currentMoonPhase, setCurrentMoonPhase] = React.useState<number>(0);
  const [nextFullMoonPhase, setNextFullMoonPhase] = React.useState<number>(1);
  const [currentDate, setCurrentDate] = React.useState<string>("");
  const [nextFullMoonDate, setNextFullMoonDate] = React.useState<string>("");
  const [selectedRow, setSelectedRow] = React.useState<any>(null);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  React.useEffect(() => {
    // Get current date and moon phase
    const today = new Date();
    setCurrentDate(moment(today).format("MMM Do, YYYY"));
    
    // Get current moon phase percentage (0-1)
    const currentPhase = Moon.lunarAgePercent();
    console.log("currentPhase", currentPhase);
    setCurrentMoonPhase(currentPhase);
    
    // Calculate next full moon date
    // Full moon is at 0.5 (50%) of the lunar cycle
    const calculateNextFullMoon = () => {
      const currentPhaseValue = currentPhase;
      const daysInLunarCycle = 29.53; // Average lunar cycle in days
      
      // Calculate days until next full moon (0.5 or 50% of cycle)
      let daysUntilFullMoon;
      if (currentPhaseValue < 0.5) {
        // If we're before full moon in current cycle
        daysUntilFullMoon = (0.5 - currentPhaseValue) * daysInLunarCycle;
      } else {
        // If we're after full moon, calculate days until next cycle's full moon
        daysUntilFullMoon = (1.5 - currentPhaseValue) * daysInLunarCycle;
      }
      
      // Calculate the date of next full moon
      const nextFullMoonDate = new Date(today);
      nextFullMoonDate.setDate(today.getDate() + Math.round(daysUntilFullMoon));
      
      return nextFullMoonDate;
    };
    
    const nextFullMoon = calculateNextFullMoon();
    setNextFullMoonDate(moment(nextFullMoon).format("MMM Do, YYYY"));
    
    // Full moon is always 0.5 in the lunar cycle
    setNextFullMoonPhase(0.5);
  }, []);

  const handleRowClick = (params: any) => {
    if (isMobile) {
      setSelectedRow(params.row);
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRow(null);
  };

  return (
    <Box>
    
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card variant="outlined" sx={{ p: 2, bgcolor: '#FAF8F5', borderColor: '#D0D0C8', height: '100%' , display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#555555', textAlign: 'center' }}>
              Current Phase
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
              <MoonPhaseDisplay lunarAgePercent={currentMoonPhase} />
            </Box>
            <Typography variant="body2" sx={{ textAlign: 'center', color: '#555555', fontWeight: 'bold' }}>
              {currentDate}
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card variant="outlined" sx={{ p: 2, bgcolor: '#FAF8F5', borderColor: '#D0D0C8', height: '100%' , display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#555555', textAlign: 'center' }}>
              Next Full Moon
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
              <MoonPhaseDisplay lunarAgePercent={0.5} />
            </Box>
            <Typography variant="body2" sx={{ textAlign: 'center', color: '#555555', fontWeight: 'bold' }}>
              {nextFullMoonDate}
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card variant="outlined" sx={{ p: 2, bgcolor: '#FAF8F5', borderColor: '#D0D0C8', height: '100%' , display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#555555', textAlign: 'center' }}>
              Crop Compass
            </Typography>
            <CropCompassGauge value={netChargeBalance} />
            <Typography variant="body2" sx={{ textAlign: 'center', color: '#555555', fontWeight: 'bold' }}>
              {getCropCompassResult(netChargeBalance)}
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card variant="outlined" sx={{ p: 2, bgcolor: '#FAF8F5', borderColor: '#D0D0C8', height: '100%' , display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#555555', textAlign: 'center' }}>
              Sudden Whilt Risk
            </Typography>
            {!isDryTissue ? (
              <>
                <SuddenWhiltGauge value={whiltRisk} />
                <Typography variant="body2" sx={{ textAlign: 'center', color: '#555555', fontWeight: 'bold' }}>
                  {getWhiltRisk(whiltRisk)}
                </Typography>
              </>
            ) : (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="h5" sx={{ color: '#555555' }}>N/A</Typography>
                </Box>
                <Typography variant="body2" sx={{ textAlign: 'center', color: '#555555', fontWeight: 'bold' }}>
                  Not available for dry tissue
                </Typography>
              </>
            )}
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mb: 4, height: 600 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Nutrient Recommendations
      </Typography>
        <CustomizedDataGrid
          rows={[]}
          columns={isMobile ? mobileFertilizerColumns : fertilizerColumns}
          pageSize={60}
          checkboxSelection={false}
          disableColumnResize={false}
          density="standard"
          onRowClick={handleRowClick}
        />
      </Box>

      {/* Dialog for mobile view to show detailed row information */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Fertilizer Details
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedRow && (
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">Fertilizer</TableCell>
                    <TableCell>{selectedRow.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Rate (Kg/ha)</TableCell>
                    <TableCell>{selectedRow.rate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">App Time</TableCell>
                    <TableCell>{selectedRow.appTime}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">App Method</TableCell>
                    <TableCell>{selectedRow.appMethod}</TableCell>
                  </TableRow>
                  {selectedRow.N && (
                    <TableRow>
                      <TableCell component="th" scope="row">N</TableCell>
                      <TableCell>{selectedRow.N}</TableCell>
                    </TableRow>
                  )}
                  {selectedRow.P && (
                    <TableRow>
                      <TableCell component="th" scope="row">P</TableCell>
                      <TableCell>{selectedRow.P}</TableCell>
                    </TableRow>
                  )}
                  {selectedRow.K && (
                    <TableRow>
                      <TableCell component="th" scope="row">K</TableCell>
                      <TableCell>{selectedRow.K}</TableCell>
                    </TableRow>
                  )}
                  {selectedRow.S && (
                    <TableRow>
                      <TableCell component="th" scope="row">S</TableCell>
                      <TableCell>{selectedRow.S}</TableCell>
                    </TableRow>
                  )}
                  {selectedRow.Ca && (
                    <TableRow>
                      <TableCell component="th" scope="row">Ca</TableCell>
                      <TableCell>{selectedRow.Ca}</TableCell>
                    </TableRow>
                  )}
                  {selectedRow.Mg && (
                    <TableRow>
                      <TableCell component="th" scope="row">Mg</TableCell>
                      <TableCell>{selectedRow.Mg}</TableCell>
                    </TableRow>
                  )}
                  {selectedRow.Zn && (
                    <TableRow>
                      <TableCell component="th" scope="row">Zn</TableCell>
                      <TableCell>{selectedRow.Zn}</TableCell>
                    </TableRow>
                  )}
                  {selectedRow.B && (
                    <TableRow>
                      <TableCell component="th" scope="row">B</TableCell>
                      <TableCell>{selectedRow.B}</TableCell>
                    </TableRow>
                  )}
                  {selectedRow.Fe && (
                    <TableRow>
                      <TableCell component="th" scope="row">Fe</TableCell>
                      <TableCell>{selectedRow.Fe}</TableCell>
                    </TableRow>
                  )}
                  {selectedRow.Cu && (
                    <TableRow>
                      <TableCell component="th" scope="row">Cu</TableCell>
                      <TableCell>{selectedRow.Cu}</TableCell>
                    </TableRow>
                  )}
                  {selectedRow.Mn && (
                    <TableRow>
                      <TableCell component="th" scope="row">Mn</TableCell>
                      <TableCell>{selectedRow.Mn}</TableCell>
                    </TableRow>
                  )}
                  {selectedRow.Mo && (
                    <TableRow>
                      <TableCell component="th" scope="row">Mo</TableCell>
                      <TableCell>{selectedRow.Mo}</TableCell>
                    </TableRow>
                  )}
                  {selectedRow.Co && (
                    <TableRow>
                      <TableCell component="th" scope="row">Co</TableCell>
                      <TableCell>{selectedRow.Co}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
} 