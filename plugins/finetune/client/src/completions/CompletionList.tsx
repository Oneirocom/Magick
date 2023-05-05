// DOCUMENTED 
// Import required libraries and components
import Button from '@mui/material/Button';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FileListTable from '../files/FileListTable';
import UploadFileButton from '../files/UploadFileButton';
import FineTuneList from '../fine-tunes/FineTuneList';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, Typography } from '@mui/material';
import InfoCard from '../components/InfoCard';
import GetRecordsButton from '../files/GetRecordsButton';

/**
 * Component for displaying the classification list.
 * @returns JSX element containing the classification list.
 */
export default function ClassificationList() {
  // Use the navigate hook from react-router-dom
  const navigate = useNavigate();

  // Return the JSX element
  return (
    <main className="mx-auto space-y-12 max-w-4xl">
      <InfoCard>
        <Box component={'div'} style={{ width: '100%' }}> 
          <Box
            component={'div'}
            display={'flex'}
            justifyContent={'space-between'}
            flexWrap={'nowrap'}
            flexDirection={'row'}
            padding={1}
          >
            {/* TODO: Remove hardcoded color when global MUI themes are supported */}
            <Typography variant="h4" component="h2" color="white">
              Completions
            </Typography>
            <Button
              size="small"
              variant="contained"
              style={{backgroundColor: 'purple', color: 'white' }}
              onClick={() => navigate('/fineTuneManager/fine-tunes/new')}
              startIcon={<AddCircleOutlineIcon />}
            >
              New Model
            </Button>
          </Box>
        </Box>
        <FineTuneList />
      </InfoCard>
      <InfoCard>
        <Box component={'div'} style={{ width: '100%' }}>
          <Box
            component={'div'}
            display={'flex'}
            justifyContent={'space-between'}
            flexWrap={'nowrap'}
            flexDirection={'row'}
            padding={1}
          >
            {/* TODO: Remove hardcoded color when global MUI themes are supported */}
            <Typography variant="h4" component="h2" color="white">
              Training Files
            </Typography>
            <UploadFileButton
              purpose="fine-tune"
              enforce={{
                required: ['prompt', 'completion'],
                count: ['prompt', 'completion'],
                maxTokens: 2048,
              }}
            />
          </Box>
        </Box>
        <FileListTable purpose="fine-tune" />
      </InfoCard>
      <InfoCard>
        <Box component={'div'} style={{ width: '100%' }}>
          <Box
            component={'div'}
            display={'flex'}
            justifyContent={'space-between'}
            flexWrap={'nowrap'}
            flexDirection={'row'}
            padding={1}
          >
            {/* TODO: Remove hardcoded color when global MUI themes are supported */}
            <Typography variant="h4" component="h2" color="white">
              From Documents
            </Typography>
            <GetRecordsButton
              purpose="fine-tune"
              enforce={{
                required: ['prompt', 'completion'],
                count: ['prompt', 'completion'],
                maxTokens: 2048,
              }}
            />
          </Box>
        </Box>
        <FileListTable purpose="fine-tune" />
      </InfoCard>
      <InfoCard>
        <h1>Instructions</h1>
        <p>
          To fine-tune the model, first upload a file containing prompts and completions.
        </p>
        <p>
          The file can be CSV, Excel, or JSONL. It must contain two columns, "prompt" and "completion". For Excel, the first column is "prompt", and the second column is "completion". Combined they cannot have more than 2048 tokens. <a href="https://beta.openai.com/docs/guides/fine-tuning/preparing-your-dataset">Learn more</a>.
        </p>
        <p>
          Then create a new model using that training file. You can use a second file for validating the model. Read more about <a href="https://beta.openai.com/docs/guides/completion/prompt-design">prompt design</a> and <a href="https://beta.openai.com/docs/guides/completion/evaluation">evaluation</a>.
        </p>
        <h4>For example:</h4>
        <p>
          {`{ "prompt": "Company: BHFF cars\nProduct: cars\nAd:One stop shop!\nSupported:", "completion": "yes" }
          { "prompt": "Company: Loft teeth\nProduct: -\nAd:Straight teeth in weeks!\nSupported:", "completion":"no" }`} 
        </p>
      </InfoCard>
    </main>
  );
}
