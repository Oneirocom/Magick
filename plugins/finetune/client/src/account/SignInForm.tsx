// DOCUMENTED 
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoCard from '../components/InfoCard';
import useAuthentication from './useAuthentication';

/**
 * SigninForm component, provides the user with information about configuring the
 * API key and handling navigation to settings or other pages.
 */
export default function SigninForm() {
  const navigate = useNavigate();
  const { signIn } = useAuthentication();

  useEffect(() => {
    const secrets = JSON.parse(window.localStorage.getItem('secrets') || '{}');
    const openai = secrets['openai_api_key'];
    if (openai) {
      signIn(openai, '');
      navigate('/fineTuneManager/completions');
    } else {
      console.log('no api key found');
    }
  }, []);

  return (
    <section className="space-y-4">
      <Box component={'span'} sx={{ textAlign: 'center' }}>
        <Typography variant="h4" component="h2" color="white">
          Fine Tune Manager
        </Typography>
      </Box>
      <InfoCard>
        <Box component={'span'} sx={{ textAlign: 'center' }}>
          <form className="py-8 space-y-8">
            <div>
              <p>
                Configure Your Open AI key
                <Button
                  style={{ marginLeft: '10px' }}
                  onClick={() => navigate('/settings')}
                >
                  here.
                </Button>
              </p>
            </div>
            <div></div>
          </form>
        </Box>
        <Box component={'span'} sx={{ textAlign: 'center' }}>
          <Promo />
          <Footer />
        </Box>
      </InfoCard>
    </section>
  );
}

/**
 * Promo component, lists the features of the fine tune manager.
 */
function Promo() {
  return (
    <section>
      <ul className="mt-8 text-xl list-disc">
        <li>
          <b>Fine tune</b> completion models by uploading training and validation
          files
        </li>
        <li>CSV, Excel spreadsheets, and of course JSONL</li>
        <li>Play around and see the API requests</li>
      </ul>
    </section>
  );
}

/**
 * Footer component, informs the user about usage limits, terms, conditions and API usage responsibilities.
 */
function Footer() {
  return (
    <footer>
      <p>
        For usage limits, terms and conditions, billing and charges, etc check
        your OpenAI account. Use responsibly.
      </p>
    </footer>
  );
}
