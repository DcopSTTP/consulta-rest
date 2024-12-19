import { Box, Button, Typography, Grid2, Paper, Grid } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputProtocolo from '../../Inputs/Protocolo';
import LogoNEAT from '/img/Logo-NEAT-Preta.svg';
import Background from '/img/background.png';
import Swal from 'sweetalert2';
import CroquiService from '../../../../services/CroquiService';
const croquiService = new CroquiService();
import LogoCG from '/img/Logo-CampinaGrande.png';
import LogoSTTP from '/img/Logo-STTP.png';
import Captcha from '../../Captcha';

export default function FormPesquisa() {
  const [protocolo, setProtocolo] = useState('');
  const navigate = useNavigate();
  const [solvedCaptcha, setSolverCaptcha] = useState(false);

  const handleCaptchaVerified = (token) => {
    setSolverCaptcha(true);
  };

  async function pesquisar(e) {
    e.preventDefault();

    Swal.fire({
      title: "Buscando protocolo...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      didClose: () => {
        Swal.hideLoading();
      }
    });

    try {
      const response = await croquiService.getCroquiProtocolo(protocolo);

      if (response) {
        Swal.fire({
          icon: "success",
          title: "Protocolo encontrado!",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          willClose: () => {
            navigate('/protocolo', { state: { dados: response } });
          }
        });
      }
    } catch (error) {
      Swal.close();
      Swal.fire("Erro", error.message);
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${Background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Grid2 item xs={12} sm={8} md={5} component={Paper} elevation={6} sx={{ zIndex: 1 }}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={LogoCG} alt="logo-cg" width={130} style={{ marginRight: '10px' }} />
            <img src={LogoSTTP} alt="logo-cg" width={127} />
          </div>

          <img src={LogoNEAT} alt="logo-neat" className="mb-2 mt-4" width={110} />

          <Typography component="h1" sx={{ fontSize: '27px' }}>
            Acessar Protocolo
          </Typography>
          <Typography component="h1" sx={{ maxWidth: '400px', textAlign: 'center', m: '8px' }}>
            Insira do número do protocolo enviado por e-mail para visualizar os dados do acidente
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={pesquisar}>
            <InputProtocolo
              value={protocolo}
              setValue={setProtocolo}
              label="Protocolo"
              placeholder="Insira o número do protocolo"
              readOnly={false}
              shrink={true}
            />
            <Captcha onCaptchaVerified={handleCaptchaVerified} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mb: 2 }}
              disabled={!solvedCaptcha || !protocolo}
            >
              Enviar
            </Button>
          </Box>
        </Box>
      </Grid2>
      <p style={{
        position: 'absolute',
        top: '15px',
        left: '20px',
        margin: 0,
        fontSize: '11px'
      }}>
        Versão 1.0.4
      </p>
    </Box>
  );
}
