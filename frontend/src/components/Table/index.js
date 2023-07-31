import {useState, useMemo, useEffect} from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import Input from '@mui/material/Input'
import CloseIcon from '@mui/icons-material/Close'
import DoneIcon from '@mui/icons-material/Done'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import '../../style/OwnTable.css'
import {TableToolbar} from '../TableToolbar'
import {OwnTableHead} from '../OwnTableHead'
import axios from 'axios'

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

OwnTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
}

TableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
}

export const OwnTable = () => {
  const DB_URL = 'http://localhost:8000/users'
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('name')
  const [selected, setSelected] = useState([])
  const [addData, setAddData] = useState(false)
  const [filterRow, setFilterRow] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [rows, setRows] = useState([])
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
  const [rowCount, setRowCount] = useState(rows?.length)

  const fetchData = async () => {
    try {
      const res = await axios.get(DB_URL)
      setRows(res.data)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  

  useEffect(() => {
    const filteredRows = stableSort(rows, getComparator(order, orderBy)).filter((row) => {
      const fullNameMatch = row?.userName?.toLowerCase().includes(filterValues.fullName.toLowerCase())
      const idMatch = row?.myId?.toLowerCase().includes(filterValues.id.toLowerCase())
      const phoneNumberMatch = row?.phoneNumber?.toLowerCase().includes(filterValues.phoneNumber.toLowerCase())
      const ipMatch = row?.ip?.toLowerCase().includes(filterValues.ip.toLowerCase())
      return fullNameMatch && idMatch && phoneNumberMatch && ipMatch
    })
    setRowCount(filteredRows.length)
    setPage(0)
  }, [order, orderBy, rows, filterValues])
  

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows?.map((n) => n._id)
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

  const validateNewUserDetails = (userDetails) => {
    const namePattern = /^[A-Za-z\s]+$/
    const idPattern = /^\d{9}$/
    const phoneNumberPattern = /^(\+?\d{1,3})?[0-9]{6,}$/
    const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const errorMessages = []
    if (!userDetails.fullName || !namePattern.test(userDetails.fullName)) {
      errorMessages.push('fullName')
    }
    if (!userDetails.id || !idPattern.test(userDetails.id)) {
      errorMessages.push('myId')
    }
    if (!userDetails.phone || !phoneNumberPattern.test(userDetails.phone)) {
      errorMessages.push('phoneNumber')
    }
    if (!userDetails.ip || !ipPattern.test(userDetails.ip)) {
      errorMessages.push('ip')
    }
    if (!userDetails.email || !emailPattern.test(userDetails.email)) {
      errorMessages.push('email')
    }
    return errorMessages
  }


  const handleChangeNewUser = (event) => {
    const { name, value } = event.target
    setNewUserDetails({
        ...newUserDetails,
        [name]: value,
    })
  }

  const handleFilter = (event) => {
    const { name, value } = event.target
    setFilterValues((prevFilterValues) => ({
    ...prevFilterValues,
      [name]: value,
    }))
  }

  const newRecord = async () => {
    const errorMessages = validateNewUserDetails(newUserDetails)
    if (errorMessages.length > 0) {
      return
    }
    await axios.post(DB_URL,
      {
        userName: newUserDetails.fullName,
        email: newUserDetails.email,
        myId: newUserDetails.id,
        phoneNumber: newUserDetails.phone,
        ip: newUserDetails.ip
      }
    )
    setNewUserDetails({
      email: '',
      fullName: '',
      id: '',
      phone: '',
      ip: '',
    })
    fetchData()
  }

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(newRowsPerPage)
    setPage(0)
  }

  const isSelected = (name) => selected.indexOf(name) !== -1

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows?.length) : 0

  const visibleRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).filter((row) => {
        return (
          row?.userName?.toLowerCase().includes(filterValues.fullName.toLowerCase()) &&
          row?.myId?.toLowerCase().includes(filterValues.id.toLowerCase()) &&
          row?.phoneNumber?.toLowerCase().includes(filterValues.phoneNumber.toLowerCase()) &&
          row?.ip?.toLowerCase().includes(filterValues.ip.toLowerCase())
        )
      }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, rows, filterValues, page, rowsPerPage]
  )

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableToolbar numSelected={selected.length} 
                      setAddData={setAddData}
                      addData={addData}
                      selected={selected}
                      setSelected={setSelected}
                      filterRow={filterRow}
                      setFilterRow={setFilterRow}
                      fetchData={fetchData} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }}
                 aria-labelledby="tableTitle" >
            <OwnTableHead numSelected={selected.length}
                          order={order}
                          orderBy={orderBy}
                          onSelectAllClick={handleSelectAllClick}
                          onRequestSort={handleRequestSort}
                          rowCount={rows?.length}
                          setAddData={setAddData}
                          addData={addData} />
            <TableBody>
            {addData && <TableRow hover
                      role="add-row"
                      tabIndex={-1}>
                <TableCell>
                <Input color={validateNewUserDetails(newUserDetails).includes("email") ? "error" : "primary"}
                           placeholder='Email'
                           name="email"
                           value={newUserDetails.email}
                           onChange={handleChangeNewUser} />
                </TableCell>
                <TableCell padding="checkbox">
                    <Input color={validateNewUserDetails(newUserDetails).includes("fullName") ? "error" : "primary"}
                           placeholder='Full Name'
                           name="fullName"
                           value={newUserDetails.fullName}
                           onChange={handleChangeNewUser} />
                </TableCell>
                <TableCell padding="checkbox">
                    <Input color={validateNewUserDetails(newUserDetails).includes("myId") ? "error" : "primary"}
                           placeholder='ID'
                           name="id"
                           value={newUserDetails.id}
                           onChange={handleChangeNewUser} />
                </TableCell>
                <TableCell padding="checkbox">
                    <Input color={validateNewUserDetails(newUserDetails).includes("phoneNumber") ? "error" : "primary"}
                           placeholder='Phone Number'
                           type="phoneNumber"
                           name="phone"
                           value={newUserDetails.phone}
                           onChange={handleChangeNewUser} />
                </TableCell>
                <TableCell padding="checkbox">
                    <Input color={validateNewUserDetails(newUserDetails).includes("ip") ? "error" : "primary"}
                           placeholder='IP Address'
                           name="ip"
                           value={newUserDetails.ip}
                           onChange={handleChangeNewUser} />
                </TableCell>
                <TableCell padding="checkbox">
                <Tooltip title="Save new client">
                    <IconButton onClick={newRecord}>
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
                const isItemSelected = isSelected(row?._id)
                const labelId = `enhanced-table-checkbox-${index}`
                return (
                  <TableRow hover
                            onClick={(event) => handleClick(event, row?._id)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row?._id}
                            selected={isItemSelected}
                            sx={{ cursor: 'pointer' }} >
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
                      {row?.userName}
                    </TableCell>
                    <TableCell align="center">{row?.myId}</TableCell>
                    <TableCell align="center">{row?.phoneNumber}</TableCell>
                    <TableCell align="center">{row?.ip}</TableCell>
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

        {/* {visibleRows.map(row => console.log(row))}
        {isSelected} */}
      </Paper>
    </Box>
  )
}
