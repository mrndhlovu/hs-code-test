import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  useRef,
} from "react"
import ReactDOM from "react-dom"
import PropTypes from "proptypes"

import "../styles/index.scss"

const IMAGE_NOT_FOUND_PLACEHOLDER =
  "https://res.cloudinary.com/drxavrtbi/image/upload/v1633025966/projects/not-found-image-15383864787lu_bietqg.jpg"

const DATA_ENDPOINT =
  "https://raw.githubusercontent.com/HubSpotWebTeam/CodeExercise/main/src/js/data/data.json"

const GET_GENRE_OPTIONS = [
  "action",
  "adventure",
  "animation",
  "biography",
  "classic",
  "comedy",
  "crime",
]

const YEAR_FILTER_OPTIONS = [
  "1870",
  "1892",
  "1895",
  "1963",
  "1971",
  "1973",
  "1974",
]

const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const clientRequestData = async () => {
  return await fetch(DATA_ENDPOINT)
    .then((response) => {
      if (response.ok) {
        const responseData = response.json()
        return responseData
      }
      return
    })
    .catch((error) => {
      return error.message
    })
}

const getNewData = (data, filterOptions) => {
  const hasGenreFilter = filterOptions.genre.length > 0
  const hasYearFilter = filterOptions.year.length > 0
  const hasTypeFilter = filterOptions.type !== ""

  let dataCopy = []

  if (hasGenreFilter) {
    dataCopy = [
      ...dataCopy,
      ...data.filter((item) =>
        item.genre.some(
          (value) =>
            filterOptions.genre.includes(value) && dataCopy.indexOf(item) === -1
        )
      ),
    ]
  }

  if (hasYearFilter) {
    dataCopy = [
      ...dataCopy,
      ...data.filter(
        (item) =>
          filterOptions.year.includes(item.year) &&
          dataCopy.indexOf(item) === -1
      ),
    ]
  }

  if (hasTypeFilter) {
    if (dataCopy.length === 0) {
      dataCopy = data
    }
    dataCopy = [...dataCopy.filter((item) => item.type === filterOptions.type)]
  }

  return dataCopy
}

const sortData = (data = []) => {
  return data.sort((a, b) => a?.title.localeCompare(b?.title))
}

const ExerciseTwoContext = createContext(null)
const useExerciseContext = () => useContext(ExerciseTwoContext)

const FILTERS_INITIAL_STATE = {
  genre: [],
  year: [],
  type: "",
  searchQuery: "",
}

const ExerciseTwoContextProvider = ({ children }) => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [filters, setFilters] = useState(FILTERS_INITIAL_STATE)
  const previous = usePrevious(filters)

  const hasAppliedFilter =
    filters.genre.length > 0 || filters.year.length > 0 || filters.type !== ""

  const newFilter = hasAppliedFilter
    ? Object.keys(previous).find(
        (prevKey) => previous[prevKey] !== filters[prevKey]
      )
    : undefined

  const toggleActiveMediaType = (ev) => {
    setFilters((prev) => ({ ...prev, type: ev.target.id }))
  }

  const handleClearFilters = () => {
    setFilters(FILTERS_INITIAL_STATE)
    setFilteredData(data)
  }

  const handleSelectedFilterOption = (ev) => {
    const [filterType, value, index] = ev.target.id.split("|")

    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].slice(index, 1)
        : [...prev[filterType], value],
    }))
  }

  const filterByQuery = (searchTerm) => {
    const searchResults = data.filter((item) => {
      return item.title.toLowerCase().indexOf(searchTerm) !== -1
    })

    return setFilteredData(searchResults)
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await clientRequestData()
      setData(sortData(response.media))
      setFilteredData(sortData(response.media))
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (!newFilter) return
    setFilteredData(getNewData(data, filters))
  }, [filters, data, newFilter])

  return (
    <ExerciseTwoContext.Provider
      value={{
        data: filteredData,
        filters,
        handleClearFilters,
        handleSelectedFilterOption,
        toggleActiveMediaType,
        filterByQuery,
      }}
    >
      {children}
    </ExerciseTwoContext.Provider>
  )
}

const RadioButton = ({ name, handleChange, label, checked }) => {
  return (
    <div className="ui-radio-btn">
      <input
        name={name}
        type="radio"
        onChange={handleChange}
        checked={checked}
        id={name}
      />
      <label htmlFor={name}>{label}</label>
    </div>
  )
}

RadioButton.protoTypes = {
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  handle: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
}

const Image = ({ item }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const toggleIsLoading = () => setIsLoading(false)
  const toggleImageError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  return (
    <div className="img-container">
      <div className="img-wrapper">
        {isLoading && <div className="image-skeleton loading" />}
        {imageError ? (
          <img src={IMAGE_NOT_FOUND_PLACEHOLDER} />
        ) : (
          <img
            onError={toggleImageError}
            onLoad={toggleIsLoading}
            src={item.poster}
            alt={item.title}
          />
        )}
      </div>
      <div className="img-detail">
        <span>{`${item.title} (${item.year})`}</span>
        <div>
          <span>Genres</span>
          {item.genre.map((genre, index) => (
            <span key={index}>, {genre}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

Image.protoTypes = {
  item: PropTypes.shape({
    genre: PropTypes.arrayOf(PropTypes.string),
    poster: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    year: PropTypes.string,
  }),
}

const SelectFilter = ({
  options = [],
  selectedOptions = [],
  name,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const listOptionsRef = useRef()

  const displayValue = `${options.length} ${name}`

  const toggleOpenState = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <div className={`ui-select ${name}`}>
      <select onMouseDown={toggleOpenState} defaultValue={displayValue}>
        <option className="hide-option" disabled defaultValue={displayValue}>
          {displayValue}
        </option>
      </select>
      {isOpen && (
        <div
          ref={listOptionsRef}
          className="checkbox-list"
          onMouseLeave={toggleOpenState}
        >
          {options.map((option, index) => {
            const isChecked = selectedOptions.includes(option)

            return (
              <label htmlFor={`label-${index}`}>
                <input
                  name={`label-${index}`}
                  type="checkbox"
                  checked={isChecked}
                  value={option}
                  id={`${name}|${option}|${index}`}
                  onChange={onChange}
                />
                {option}
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

SelectFilter.propTypes = {
  name: PropTypes.string.isRequired,
  selectedOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
}

const FilterOptions = () => {
  const { filters, handleSelectedFilterOption, filterByQuery } =
    useExerciseContext()

  const handleChange = (ev) => {
    const searchTerm = ev.target.value

    filterByQuery(searchTerm)
  }

  return (
    <div className="media-block-filter-options">
      <div className="media-block-select-options">
        <SelectFilter
          name="genre"
          options={GET_GENRE_OPTIONS}
          selectedOptions={filters?.genre}
          onChange={handleSelectedFilterOption}
        />
        <SelectFilter
          name="year"
          options={YEAR_FILTER_OPTIONS}
          selectedOptions={filters?.year}
          onChange={handleSelectedFilterOption}
        />
      </div>
      <div className="media-block-search search-input-container">
        <input
          placeholder="Search"
          className="ui-input"
          onChange={handleChange}
        ></input>
      </div>
    </div>
  )
}

const ExerciseTwo = () => {
  const { data, filters, toggleActiveMediaType, handleClearFilters } =
    useExerciseContext()

  return (
    <div className="media-block">
      <div className="media-block-wrapper">
        <div className="media-block-header">
          <FilterOptions />

          <div className="media-block-filter-options">
            <div className="media-block-radio-options">
              <RadioButton
                name="movie"
                label="Movies"
                handleChange={toggleActiveMediaType}
                checked={filters.type === "movie"}
              />
              <RadioButton
                name="book"
                label="Books"
                handleChange={toggleActiveMediaType}
                checked={filters.type === "book"}
              />
            </div>
            <div className="media-block-clear-filters">
              <button className="ui-link-btn" onClick={handleClearFilters}>
                Clear Filters
              </button>
            </div>
          </div>
        </div>
        <div className="media-block-content">
          {data.map((item, index) => (
            <Image key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

const ExerciseTwoComponent = () => {
  return (
    <ExerciseTwoContextProvider>
      <ExerciseTwo />
    </ExerciseTwoContextProvider>
  )
}

const ROOT_ELEMENT = document.getElementById("exercise-two-root")

ReactDOM.render(<ExerciseTwoComponent />, ROOT_ELEMENT)
