import {useState, useMemo, useEffect} from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import Input from '@mui/material/Input'
import CloseIcon from '@mui/icons-material/Close'
import DoneIcon from '@mui/icons-material/Done'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { visuallyHidden } from '@mui/utils'
import '../../style/OwnTable.css'
import {TableToolbar} from '../TableToolbar'

function createData(name, id, phoneNumber, ip) {
  return {
    name,
    id,
    phoneNumber,
    ip,
  }
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Full Name',
  },
  {
    id: 'id',
    numeric: false,
    disablePadding: false,
    label: 'ID',
  },
  {
    id: 'phoneNumber',
    numeric: false,
    disablePadding: false,
    label: 'Phone Number',
  },
  {
    id: 'ip',
    numeric: false,
    disablePadding: false,
    label: 'IP Address',
  },
]

function OwnTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, addData }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align='left'
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        {addData && <TableCell />}
      </TableRow>
    </TableHead>
  )
}

OwnTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
}

/* const filterClients = () => {
    const filteredData = rows.filter((row) =>
      row.name.toLowerCase().includes(filterValue.toLowerCase())
    )
    setFilteredRows(filteredData)
} */

TableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
}

export const OwnTable = () => {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('name')
  const [selected, setSelected] = useState([])
  const [addData, setAddData] = useState(false)
  const [filterRow, setFilterRow] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [rows, setRows] = useState([
    createData('Mia Tremblay1', '637011271', '+972506407311', '29.53.136.101'),
    createData('Mia Tremblay2', '637011272', '+972506407312', '29.53.136.102'),
    createData('Mia Tremblay3', '637011273', '+972506407313', '29.53.136.103'),
    createData('Mia Tremblay4', '637011274', '+972506407314', '29.53.136.104'),
    createData('Mia Tremblay5', '637011275', '+972506407315', '29.53.136.105'),
    createData('Mia Tremblay6', '637011276', '+972506407316', '29.53.136.106'),
  ])
  const [newUserDetails, setNewUserDetails] = useState({
    email: '',
    fullName: '',
    id: '',
    phone: '',
    ip: '',
  })
  const [filterValues, setFilterValues] = useState({
    fullName: '',
    id: '',
    phoneNumber: '',
    ip: '',
  })
  const [rowCount, setRowCount] = useState(rows.length); // Add this state


  useEffect(() => {
    // Update the rowCount whenever the rows or filterValues change
    setRowCount(
      stableSort(rows, getComparator(order, orderBy)).filter((row) => {
        // Check each column's filter value and apply filtering if necessary
        return (
          row.name.toLowerCase().includes(filterValues.fullName.toLowerCase()) &&
          row.id.toLowerCase().includes(filterValues.id.toLowerCase()) &&
          row.phoneNumber.toLowerCase().includes(filterValues.phoneNumber.toLowerCase()) &&
          row.ip.toLowerCase().includes(filterValues.ip.toLowerCase())
        )
      }).length
    )
    setPage(0) // Reset the page to 0 when filters change
  }, [order, orderBy, rows, filterValues])

  useEffect(() => {console.log('filterValuesfilterValues', filterValues)}, [filterValues])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }

    setSelected(newSelected)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeNewUser = (event) => {
    const { name, value } = event.target
    setNewUserDetails({
        ...newUserDetails,
        [name]: value,
    })
  }

  const handleFilter = (event) => {
    const { name, value } = event.target;
    console.log('handleFilter value', value)
    setFilterValues((prevFilterValues) => ({
    ...prevFilterValues,
      [name]: value,
    }))
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = (name) => selected.indexOf(name) !== -1

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const visibleRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).filter((row) => {
        return (
          row.name.toLowerCase().includes(filterValues.fullName.toLowerCase()) &&
          row.id.toLowerCase().includes(filterValues.id.toLowerCase()) &&
          row.phoneNumber.toLowerCase().includes(filterValues.phoneNumber.toLowerCase()) &&
          row.ip.toLowerCase().includes(filterValues.ip.toLowerCase())
        )
      }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, rows, filterValues, page]
  )

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableToolbar numSelected={selected.length} 
                      setAddData={setAddData}
                      addData={addData}
                      selected={selected}
                      setSelected={setSelected}
                      rows={rows}
                      setRows={setRows}
                      filterRow={filterRow}
                      setFilterRow={setFilterRow}/>
        <TableContainer>
          <Table sx={{ minWidth: 750 }}
                 aria-labelledby="tableTitle" >
            <OwnTableHead numSelected={selected.length}
                          order={order}
                          orderBy={orderBy}
                          onSelectAllClick={handleSelectAllClick}
                          onRequestSort={handleRequestSort}
                          rowCount={rows.length}
                          setAddData={setAddData}
                          addData={addData} />
            <TableBody>
            {addData && <TableRow hover
                      role="add-row"
                      tabIndex={-1}>
                <TableCell>
                <Input color="primary"
                           placeholder='Email'
                           name="email"
                           value={newUserDetails.email}
                           onChange={handleChangeNewUser} />
                </TableCell>
                <TableCell padding="checkbox">
                    <Input color="primary"
                           placeholder='Full Name'
                           name="fullName"
                           value={newUserDetails.fullName}
                           onChange={handleChangeNewUser} />
                </TableCell>
                <TableCell padding="checkbox">
                    <Input color="primary"
                           placeholder='ID'
                           name="id"
                           value={newUserDetails.id}
                           onChange={handleChangeNewUser} />
                </TableCell>
                <TableCell padding="checkbox">
                    <Input color="primary"
                           placeholder='Phone Number'
                           type="phoneNumber"
                           name="phoneNumber"
                           value={newUserDetails.phone}
                           onChange={handleChangeNewUser} />
                </TableCell>
                <TableCell padding="checkbox">
                    <Input color="primary"
                           placeholder='IP Address'
                           name="ip"
                           value={newUserDetails.ip}
                           onChange={handleChangeNewUser} />
                </TableCell>
                <TableCell padding="checkbox">
                <Tooltip title="Save new client">
                    <IconButton> {/* TODO: add newRecord function */}
                        <DoneIcon />
                    </IconButton>
                    </Tooltip>
                    <Tooltip title="Close add client row">
                    <IconButton onClick={() => setAddData(false)} >
                        <CloseIcon />
                    </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>}
            {filterRow && <TableRow hover
                      role="add-row"
                      tabIndex={-1}>
                <TableCell>
                </TableCell>
                <TableCell padding="checkbox">
                    <Input color="primary"
                           placeholder='Full Name'
                           name="fullName"
                           onChange={handleFilter} />
                </TableCell>
                <TableCell padding="checkbox">
                    <Input color="primary"
                           placeholder='ID'
                           name="id"
                           onChange={handleFilter} />
                </TableCell>
                <TableCell padding="checkbox">
                    <Input color="primary"
                           placeholder='Phone Number'
                           type="phoneNumber"
                           name="phoneNumber"
                           onChange={handleFilter} />
                </TableCell>
                <TableCell padding="checkbox">
                    <Input color="primary"
                           placeholder='IP Address'
                           name="ip"
                           onChange={handleFilter} />
                </TableCell>
            </TableRow>}
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.name)
                const labelId = `enhanced-table-checkbox-${index}`

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.name)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell component="th"
                               id={labelId}
                               scope="row"
                               padding="none">
                      {row.name}
                    </TableCell>
                    <TableCell align="center">{row.id}</TableCell>
                    <TableCell align="center">{row.phoneNumber}</TableCell>
                    <TableCell align="center">{row.ip}</TableCell>
                    {addData && <TableCell />}
                  </TableRow>
                )
              })}
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[5, 10, 25]}
                         component="div"
                         count={rowCount}
                         rowsPerPage={rowsPerPage}
                         page={page}
                         onPageChange={handleChangePage}
                         onRowsPerPageChange={handleChangeRowsPerPage} />
        {/* TODO: remove this {selected.map(selected => <div>{selected}</div>)} */}
        {/* TODO: {rows.map(visibleRow => {
            return (
                <div>{visibleRow.name}|{visibleRow.id}</div>
            )
        })} */}
      </Paper>
    </Box>
  )
}
