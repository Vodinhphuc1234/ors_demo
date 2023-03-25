import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { notinatimSearch } from '../api/notinatim';
import { Button } from '@mui/material';

export default function Search({ handleSearch, handleDelete }) {
  const [results, setResults] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const refDebounce = React.useRef();

  React.useEffect(() => {
    clearTimeout(refDebounce.current);
    refDebounce.current = setTimeout(async () => {
      setLoading(true);
      const search = await notinatimSearch(input);
      setResults(search);
      setLoading(false);
    }, 1000);
  }, [input]);
  return (
    <Box display={'flex'}>
      <Autocomplete
        sx={{ flexGrow: 1 }}
        filterOptions={(option) => option}
        isOptionEqualToValue={() => true}
        disablePortal
        loading={loading}
        id="country-select-demo"
        options={results}
        autoHighlight
        getOptionLabel={(option) => {
          return option.display_name;
        }}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            {option.display_name}
          </Box>
        )}
        inputValue={input}
        onInputChange={(e) => {
          setInput(e?.target.value);
        }}
        onChange={(e, option) => {
          setInput(option ? option.display_name : '');
          option &&
            handleSearch({
              lat: option.lat,
              lon: option.lon,
            });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Input address"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
          />
        )}
      />
      <Button onClick={() => handleDelete()} variant="outlined" color="error">
        X
      </Button>
    </Box>
  );
}
