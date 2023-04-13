import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Routes from '../utils/routes';
import { setToken, setRefresh, setUser } from '../utils/AuthService';
import { getRandomImage } from '../utils/imageRandomizer';

import { useDispatch } from "react-redux";
import { setMyLeagues } from '../features/leagues';
import { setMyTeams } from '../features/teams';
import { setCurrentUser } from '../features/users';
import { callAPI } from '../utils/callApi';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="">
        Faceoff Fantasy
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function LoginScreen(props) {

  const dispatch = useDispatch();
  const [notify, setNotify] = React.useState("");

  async function storeTeamsAndLeagues(props) {
    callAPI(`${Routes.LEAGUES}/`).then((json) => {
      const myLeagues = json.filter((league) => league.users.includes(props.id));
      dispatch(setMyLeagues(myLeagues));
    }).catch((error) => {
      console.log(error);
    });

    callAPI(`${Routes.TEAMS}/`).then((json) => {
      const myTeams = json.filter((team) => props.teams.includes(team.id));
      dispatch(setMyTeams(myTeams));
    }).catch((error) => {
      console.log(error);
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let username = data.get('username')+"";
    let password = data.get('password')+"";
    fetch(`${Routes.AUTH.LOGIN}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      })
      .then((response) => response.json())
      .then((json) => {
        if(json.access && json.refresh) {
          setToken(json.access);
          setRefresh(json.refresh);
          fetch(`${Routes.USER}/`)
              .then((response) => response.json())
              .then((json) => {
                    for(let i = 0; i < json.length; i++) {
                        if(json[i].username === username) {
                            setUser(json[i]);
                            dispatch(setCurrentUser(json[i]));
                            storeTeamsAndLeagues(json[i]).then(() => {
                              window.location.href = "/faceoffantasy/";
                            });
                            break;
                        }
                    }
              });
        } else {
          setNotify("Invalid username or password.");
        }
      });
  };

  const bg = getRandomImage();

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${bg})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Welcome Back!
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <div style={{color: 'red'}}>{notify}</div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}