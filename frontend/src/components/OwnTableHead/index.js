import TableHead from '@mui/material/TableHead'
import TableSortLabel from '@mui/material/TableSortLabel'
import { visuallyHidden } from '@mui/utils'
import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'

export const OwnTableHead = ({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, addData }) => {
    const headCells = [
      {
          id: 'userName',
          numeric: false,
          disablePadding: true,
          label: 'Full Name',
      },
      {
          id: 'myId',
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