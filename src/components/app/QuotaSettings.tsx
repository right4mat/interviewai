"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import { Card, LinearProgress, Stack, Tooltip } from "@mui/material";
import { useT } from "@/i18n/client";
import moment from "moment";

interface QuotaInfo {
  resumeUploads: {
    used: number;
    total: number;
  };
  mockInterviews: {
    used: number;
    total: number;
  };
  quotaRefreshTime: string; // UTC timestamp
}

export interface QuotaDisplayConfig {
  headings: {
    quotaInformation: string;
  };
  labels: {
    resumeQuota: string;
    interviewQuota: string;
    remaining: string;
    quotaRefreshes: string;
  };
}

// Mock quota data - replace with actual API call in production
const mockQuota: QuotaInfo = {
  resumeUploads: {
    used: 1,
    total: 3
  },
  mockInterviews: {
    used: 4,
    total: 10
  },
  quotaRefreshTime: "2024-04-01T00:00:00Z" // Example refresh time
};

export function QuotaDisplay({ headings, labels }: QuotaDisplayConfig) {
  const { t } = useT("settings");

  const getQuotaColor = (used: number, total: number) => {
    const percentage = (used / total) * 100;
    if (percentage >= 90) return "error";
    if (percentage >= 70) return "warning";
    return "primary";
  };

  const formatRefreshTime = (utcTime: string) => {
    return moment(utcTime).format('LLLL');
  };

  return (
    <Card sx={{ p: 3, mb: 4, backgroundColor: "background.card" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <VideoCameraFrontIcon sx={{ mr: 1, color: "text.secondary" }} />
        <Typography variant="h6" color="text.secondary">
          {t(headings.quotaInformation)}
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Stack spacing={3}>
        {/* Resume Upload Quota */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <UploadFileIcon sx={{ mr: 1, color: "text.secondary" }} />
            <Typography variant="subtitle1" color="text.secondary">
              {t(labels.resumeQuota)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box sx={{ flexGrow: 1, mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={(mockQuota.resumeUploads.used / mockQuota.resumeUploads.total) * 100}
                color={getQuotaColor(mockQuota.resumeUploads.used, mockQuota.resumeUploads.total)}
                sx={{
                  height: 15,
                }}
              />
            </Box>
            <Tooltip title={t(labels.remaining)}>
              <Typography variant="body2" color="text.secondary">
                {mockQuota.resumeUploads.total - mockQuota.resumeUploads.used}/{mockQuota.resumeUploads.total}
              </Typography>
            </Tooltip>
          </Box>
        </Box>

        {/* Mock Interview Quota */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <VideoCameraFrontIcon sx={{ mr: 1, color: "text.secondary" }} />
            <Typography variant="subtitle1" color="text.secondary">
              {t(labels.interviewQuota)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box sx={{ flexGrow: 1, mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={(mockQuota.mockInterviews.used / mockQuota.mockInterviews.total) * 100}
                color={getQuotaColor(mockQuota.mockInterviews.used, mockQuota.mockInterviews.total)}
                sx={{
                  height: 15,
                }}
              />
            </Box>
            <Tooltip title={t(labels.remaining)}>
              <Typography variant="body2" color="text.secondary">
                {mockQuota.mockInterviews.total - mockQuota.mockInterviews.used}/{mockQuota.mockInterviews.total}
              </Typography>
            </Tooltip>
          </Box>
        </Box>
      </Stack>
      <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {t(labels.quotaRefreshes)}: {formatRefreshTime(mockQuota.quotaRefreshTime)}
        </Typography>
      </Box>
    </Card>
  );
}
