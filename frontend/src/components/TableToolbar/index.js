import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import AddIcon from '@mui/icons-material/Add'
import { alpha } from '@mui/material/styles'
import axios from 'axios'


export const TableToolbar = ({numSelected, setAddData, addData, selected, setSelected, filterRow, setFilterRow, fetchData}) => {
  const DB_URL = 'http://localhost:8000/users'

  const deleteSelectedItems = async () => {
    selected.forEach(async (selectedElement) => {
      await axios.delete(DB_URL+`/${selectedElement}`,
      {data: {
          _id: selectedElement
        }}
        )
      await fetchData()
    })
    setSelected([])
  }
  
  return (
        <Toolbar sx={{
                 pl: { sm: 2 },
                 pr: { xs: 1, sm: 1 },
                 ...(numSelected > 0 && {
                 bgcolor: (theme) =>
                 alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                 }),
          }}>
          {numSelected > 0 ? (
            <Typography sx={{ flex: '1 1 100%' }}
                        color="inherit"
                        variant="subtitle1"
                        component="div">
              {numSelected} selected
            </Typography>
          ) : (
            <Typography sx={{ flex: '1 1 100%' }}
                        variant="h6"
                        id="tableTitle"
                        component="div">
              Users Management
            </Typography>
          )}
    
          {numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton onClick={deleteSelectedItems}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <div className='header-buttons-container'>
            <Tooltip title="Filter clients">
              <IconButton onClick={() => setFilterRow(!filterRow)}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add client">
              <IconButton onClick={() => setAddData(!addData)}>
                <AddIcon />
              </IconButton>
            </Tooltip>
            </div>
          )}
        </Toolbar>
      )
}
