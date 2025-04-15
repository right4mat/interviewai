import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import PeopleIcon from "@mui/icons-material/People";

interface ParticipantsListProps {
  participants: string[];
}

export default function ParticipantsList({ participants }: ParticipantsListProps): React.ReactElement {
  return (
    <Card variant='outlined' sx={{ height: "70vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, borderBottom: "1px solid #eee", display: "flex", alignItems: "center" }}>
        <PeopleIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Participants ({participants.length})</Typography>
      </Box>
      
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        <Stack spacing={2}>
          {participants.map((name, index) => (
            <Box 
              key={index}
              sx={{ 
                display: "flex", 
                alignItems: "center",
                p: 1,
                borderRadius: 1,
                bgcolor: index === 0 ? "rgba(0,0,0,0.05)" : "transparent"
              }}
            >
              <Typography>{name}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Card>
  );
} 