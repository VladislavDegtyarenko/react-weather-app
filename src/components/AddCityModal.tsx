import { addCity } from "../store/weatherSlice";

// React
import { useState, useCallback, FormEvent, lazy } from "react";

// Router
import { useNavigate } from "react-router-dom";

// MUI
import { Button, Typography } from "@mui/material";
const FormControl = lazy(() => import("@mui/material/FormControl"));
const Autocomplete = lazy(() => import("@mui/material/Autocomplete"));
const TextField = lazy(() => import("@mui/material/TextField"));

import Modal from "../ui/Modal";

import { closeModal } from "../store/modalReducer";

// hooks
import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";
import useCitySuggestions from "../hooks/useCitySuggestions";
import useDebounce from "../hooks/useDebounce";

// Types
import { City, Option } from "../types/types";

const ALREADY_ADDED_ERROR = "This city is already added";

function AddCityModal() {
  const cities = useAppSelector((state) => state.weather.cities);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const add = (city: City) => dispatch(addCity(city));

  const [selected, setSelected] = useState<Option | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue);

  const [options, isLoading] = useCitySuggestions(debouncedInputValue);

  const handleInputChange = useCallback((value: string) => {
    setError(null);
    setSelected(null);
    setInputValue(value);
  }, []);

  const handleSelect = useCallback((city: Option | null) => {
    setSelected(city);
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      // handle form submission with selected value
      e.preventDefault();
      if (!selected) return;

      if (cities.some((city) => city.id === selected.id)) {
        setError(ALREADY_ADDED_ERROR);
        return;
      }

      add(selected);
      navigate(`/${selected.id}`);
      dispatch(closeModal());

      setSelected(null);
    },
    [add, cities, debouncedInputValue, selected]
  );

  return (
    <Modal>
      <>
        <Typography variant="h5" sx={{ mb: 0, mt: 0 }}>
          Add city
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Start typing and get city name suggestions
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl sx={{ display: "flex", flexDirection: "row", mb: 2 }}>
            <Autocomplete
              sx={{
                marginRight: 2,
                flexGrow: 1,
                "& .MuiFormHelperText-root": {
                  position: "absolute",
                  top: "100%",
                },
              }}
              options={options}
              // getOptionLabel={(option) => option.label}
              renderOption={(props, { id, label }) => (
                <li {...props} key={id}>
                  {label}
                </li>
              )}
              onInputChange={(e, value) => handleInputChange(value)}
              onChange={(e, value) => handleSelect(value)}
              loading={isLoading}
              noOptionsText="No cities found"
              value={selected}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search city"
                  variant="outlined"
                  helperText={error ? ALREADY_ADDED_ERROR : " "}
                  InputProps={{
                    ...params.InputProps,
                    error: Boolean(error),
                  }}
                />
              )}
            />
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={!selected}
            >
              Add
            </Button>
          </FormControl>
        </form>
      </>
    </Modal>
  );
}

export default AddCityModal;
