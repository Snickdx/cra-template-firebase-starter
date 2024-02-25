import { useEffect, useState } from "react";
import * as React from 'react';
import Logout from "../components/auth/Logout";
import Center from "../components/utils/Center";
import {APIProvider, Map} from '@vis.gl/react-google-maps';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AppBar, Toolbar, Typography, Box, Grid, Button, CircularProgress} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import geocode from 'react-geocode';

const Home = (props) => {
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState('');

  const handleClickOpen = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        () => {
          alert('Geolocation is not supported by this browser.');
        }
      );
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Optionally reset all form fields
    setLatitude('');
    setLongitude('');
    setImage(null);
    setDescription('');
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Geocode location
    geocode.setApiKey(process.env.REACT_APP_GeocodeApiKey);
    try {
      const response = await geocode.fromAddress(location);
      const { lat, lng } = response.results[0].geometry.location;
      // Here you would handle adding the image and its
      console.log(lat, lng); // Just for demonstration, replace with actual logic to update the map

      // Close the modal after submission
      handleClose();
    } catch (error) {
      console.error("Failed to geocode the location", error);
      // Handle error (e.g., show an error message)
    }
  };


  return (
    
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Spanish Project TT
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Box container p={4}>
        <Box container>
          <Typography variant="body1">Spotting all instances of spanish writing in public areas of the islands including, advertisements, flyers, street signs etc.</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ height: "70vh" }}>
              <APIProvider apiKey={process.env.REACT_APP_MapsApiKey}>
                <Map
                  defaultCenter={{lat: 10.522444, lng: -61.2421482}}
                  defaultZoom={10}
                  gestureHandling={'greedy'}
                  disableDefaultUI={true}
                />
              </APIProvider>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="outlined" onClick={handleClickOpen}>
              Submit A Sign Picture
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
              <DialogTitle>Submit A Sign Picture</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  To submit a picture of a sign written in spanish.
                </DialogContentText>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField margin="dense" id="latitude" label="Latitude" type="text" fullWidth variant="outlined" value={latitude} disabled />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField margin="dense" id="longitude" label="Longitude" type="text" fullWidth variant="outlined" value={longitude} disabled />
                  </Grid>
                </Grid>
                <TextField margin="dense" id="description" label="Description" type="text" fullWidth variant="outlined" value={description} onChange={(e) => setDescription(e.target.value)} />
                <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
                  Upload Image
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>
                {imagePreview && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200 }} />
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleClose}>Submit</Button>
              </DialogActions>
            </Dialog>
            </Box>
          </Grid>
        </Grid>
      </Box>

    </>
  );
};

export default Home;
