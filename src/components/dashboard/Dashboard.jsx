import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

function Dashboard() {
  return (
    <>
      <Container maxWidth="lg">
        <Grid container justifyContent="center" >
          <Grid item xs={12} md={8} >
          <Card className="!shadow-none">
              <CardHeader titleTypographyProps={{fontSize : '.85rem', lineHeight:'1.5', color:'#6c757d', fontWeight:'400', fontFamily:'Rubik, sans-serif'}} className="bg-[#edeff1] border-b-0 border-solid border-[#f7f7f7] !px-6 !py-4 rounded-l-[0.25rem]" title="Dashboard" />
              <CardContent className="!p-6 text-[#6c757d]">You are logged in!</CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Dashboard;
