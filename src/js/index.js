import ReactDOM from "react-dom"
import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  useRef,
} from "react"

import "../styles/index.scss"

const IMAGE_NOT_FOUND_PLACEHOLDER =
  "https://res.cloudinary.com/drxavrtbi/image/upload/v1633025966/projects/not-found-image-15383864787lu_bietqg.jpg"

const DATA_ENDPOINT =
  "https://raw.githubusercontent.com/HubSpotWebTeam/CodeExercise/main/src/js/data/data.json"

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

const filterData = (data, filterOptions) => {
  console.log(filterOptions)
  const hasGenreFilter = filterOptions.genre
  const hasYearFilter = filterOptions.year
  const hasTypeFilter = filterOptions.type
  let dataCopy = []

  if (hasTypeFilter) {
    dataCopy = [
      ...dataCopy,
      ...data.filter((item) => item.type !== filterOptions.type),
    ]
  }

  if (hasGenreFilter) {
    dataCopy = [
      ...dataCopy,
      ...data.filter((item) =>
        item.genre.some((value) => filterOptions.genre.includes(value))
      ),
    ]
  }

  if (hasYearFilter) {
    dataCopy = [
      ...dataCopy,
      ...data.filter((item) => filterOptions.year.includes(item.year)),
    ]
  }

  return dataCopy
}

const FILTERS_INITIAL_STATE = {
  genre: [],
  year: [],
  type: "",
}

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

const ExerciseTwoContext = createContext(null)
const useExerciseContext = () => useContext(ExerciseTwoContext)

const ExerciseTwoContextProvider = ({ children }) => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [filters, setFilters] = useState(FILTERS_INITIAL_STATE)
  const previous = usePrevious(filters)

  const hasFilteredData =
    filters.genre.length > 0 || filters.year.length > 0 || filters.type !== ""

  const filteredDataIsEmpty = filteredData.length < 1

  const newFilter = hasFilteredData
    ? Object.keys(previous).find(
        (prevKey) => previous[prevKey] !== filters[prevKey]
      )
    : undefined

  const toggleActiveMediaType = (ev) =>
    setFilters((prev) => ({ ...prev, type: ev.target.id }))

  const handleClearFilters = () => {
    setFilters(FILTERS_INITIAL_STATE)
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

  useEffect(() => {
    const fetchData = async () => {
      const response = await clientRequestData()
      setData(response.media)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (!newFilter) return
    setFilteredData(
      filterData(data, {
        [newFilter]: filters?.[newFilter],
        type: filters.type,
      })
    )
  }, [filters, newFilter, filteredDataIsEmpty, data])

  return (
    <ExerciseTwoContext.Provider
      value={{
        data: filteredDataIsEmpty ? data : filteredData,
        filters,
        handleClearFilters,
        handleSelectedFilterOption,
        toggleActiveMediaType,
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

const SelectFilter = ({
  options = [],
  selectedOptions = [],
  name,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const listOptionsRef = useRef()

  const toggleOpenState = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <div className={`ui-select ${name}`}>
      <select onMouseDown={toggleOpenState} defaultValue={name}>
        <option className="hide-option" disabled defaultValue={name}>
          {name}
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

const FilterOptions = () => {
  const {
    data,
    filters,
    toggleActiveMediaType,
    handleClearFilters,
    handleSelectedFilterOption,
  } = useExerciseContext()

  const handleChange = () => {}

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
        <input className="ui-input" onChange={handleChange}></input>
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

export default ExerciseTwoComponent

const ROOT_ELEMENT = document.getElementById("exercise-two-root")

ReactDOM.render(<ExerciseTwoComponent />, ROOT_ELEMENT)
