import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import MapBox from './components/Map';
import Search from './components/Search';
import { getRoute } from './components/api/ors';

function App() {
  const [route, setRoute] = useState();
  const [directions, setDirections] = useState();
  const [searchs, setSearchs] = useState([]);
  console.log(searchs);

  const generateRoute = useCallback(async (points) => {
    const result = await getRoute(points);
    setRoute({ ...result?.features[0]?.geometry });
    setDirections({ ...result?.features[0]?.properties });
  }, []);

  const handleSearch = useCallback((index, result) => {
    setSearchs((prev) => {
      prev[index] = { ...result };
      return [...prev];
    });
  }, []);

  const handleDelete = useCallback((index) => {
    setSearchs((prev) => {
      prev.splice(index, 1);
      return [...prev];
    });
  }, []);

  const handleAddDestination = useCallback(() => {
    setSearchs([...searchs, null]);
  }, [searchs]);

  useEffect(() => {
    const temp = [...searchs.filter((search) => search)];
    temp && temp.length > 1 && generateRoute(temp);
  }, [searchs, generateRoute]);
  return (
    <Box height={'100vh'}>
      <Grid container height={'100%'} spacing={1}>
        <Grid
          item
          container
          height={'100%'}
          display={'flex'}
          direction={'column'}
          spacing={1}
          xs={3}
        >
          <Grid item>
            <Button
              onClick={handleAddDestination}
              variant="contained"
              fullWidth
            >
              Add destination
            </Button>
          </Grid>
          <Grid item>
            <Divider />
          </Grid>
          <Grid
            item
            container
            direction={'column'}
            rowGap={1}
            columnGap={1}
            maxHeight={'30%'}
          >
            {searchs?.map((search, index) => (
              <Grid item>
                <Search
                  handleDelete={() => handleDelete(index)}
                  handleSearch={(result) => handleSearch(index, result)}
                />
              </Grid>
            ))}
          </Grid>
          <Grid item>
            <Divider />
          </Grid>
          <Grid item>
            {directions && (
              <Card>
                <CardContent>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Distance: {directions?.summary?.distance} m
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Duration: {directions?.summary?.duration} seconds
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
          <Grid item>
            <Divider />
          </Grid>
          <Grid height={'0%'} overflow={'auto'} flexGrow={1} item>
            <Timeline position="alternate">
              {directions?.segments?.map((segment) =>
                segment?.steps?.map((step) => (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>{step?.instruction}</TimelineContent>
                  </TimelineItem>
                ))
              )}
            </Timeline>
          </Grid>
        </Grid>
        <Grid item xs={9}>
          <MapBox points={searchs} route={route} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
