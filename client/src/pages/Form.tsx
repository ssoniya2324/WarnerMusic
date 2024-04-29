import { Card, CardContent, TextField, Button, Typography, Box, Grid, Snackbar } from '@mui/material';
import * as React from 'react';
import { ingestData } from '../Api';
import { Link } from 'react-router-dom';
import { DropdownSelect } from '../components';

const Form: React.FC = () => {
  const [formData, setFormData] = React.useState({
    album: '',
    singer: '',
    region: '',
    language: ''
  });
  const [success, setSuccess] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await ingestData(formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          album: '',
          singer: '',
          region: '',
          language: ''
        });
      }, 3000); // Reset form after 3 seconds
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Snackbar
        open={success}
      
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        message="Data ingested successfully"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        
      />
      <form onSubmit={handleSubmit}>
        <Card sx={{ marginTop: '50px', minHeight: '150px', padding: '30px' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={3}>

              </Grid>
              <Grid item xs={6}>
              <Typography variant='h2' >Ingest Data</Typography>
                <br />
                <Box marginBottom={2}>
                <Typography variant="subtitle1">Table</Typography>
                <DropdownSelect isDisabled={true} options={['Music']} isMulti={false} onSelectionChange={[]} defaultSelection={['Music']}/>
                </Box>
                <Box marginBottom={2}>
                  <Typography variant="subtitle1">Album</Typography>
                  <TextField
                    fullWidth
                    name="album"
                    value={formData.album}
                    onChange={handleChange}
                    margin="dense"
                  />
                </Box>
                <Box marginBottom={2}>
                  <Typography variant="subtitle1">Singer</Typography>
                  <TextField
                    fullWidth
                    name="singer"
                    value={formData.singer}
                    onChange={handleChange}
                    margin="dense"
                  />
                </Box>
                <Box marginBottom={2}>
                  <Typography variant="subtitle1">Region</Typography>
                  <TextField
                    fullWidth
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    margin="dense"
                  />
                </Box>
                <Box marginBottom={2}>
                  <Typography variant="subtitle1">Language</Typography>
                  <TextField
                    fullWidth
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    margin="dense"
                  />
                </Box>
                <div>
                  
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button> 
              <Link to='/'> <Button  variant="outlined" color="primary" sx={{marginLeft:'20px'}}>
                 Back to Home
                </Button>
                </Link>  


                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
    </>
  );
};

export default Form;
