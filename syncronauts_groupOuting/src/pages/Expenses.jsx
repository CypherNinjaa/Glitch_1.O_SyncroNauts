import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Paper,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';

const Expenses = () => {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      title: 'Beach Trip - Lunch',
      amount: 120.50,
      paidBy: 'John Doe',
      category: 'Food',
      date: '2025-09-15',
      splitBetween: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson']
    },
    {
      id: 2,
      title: 'Movie Tickets',
      amount: 45.00,
      paidBy: 'Jane Smith',
      category: 'Entertainment',
      date: '2025-09-18',
      splitBetween: ['Jane Smith', 'Mike Johnson', 'Sarah Wilson']
    },
    {
      id: 3,
      title: 'Gas for Road Trip',
      amount: 80.00,
      paidBy: 'Mike Johnson',
      category: 'Transportation',
      date: '2025-09-19',
      splitBetween: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson']
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: '',
    paidBy: 'John Doe'
  });

  const categories = ['Food', 'Transportation', 'Entertainment', 'Accommodation', 'Activities', 'Other'];

  const handleAddExpense = () => {
    if (newExpense.title && newExpense.amount) {
      setExpenses([...expenses, {
        ...newExpense,
        id: expenses.length + 1,
        amount: parseFloat(newExpense.amount),
        date: new Date().toISOString().split('T')[0],
        splitBetween: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson']
      }]);
      setNewExpense({
        title: '',
        amount: '',
        category: '',
        paidBy: 'John Doe'
      });
      setOpenDialog(false);
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const perPersonShare = totalExpenses / 4; // Assuming 4 people

  const getCategoryColor = (category) => {
    // Use a more varied but still harmonious color palette
    const colors = {
      'Food': 'success',        // Subtle green - makes sense for food
      'Transportation': 'primary', // Blue - our brand color
      'Entertainment': 'secondary', // Gray - neutral
      'Accommodation': 'warning',   // Subtle amber - for accommodation
      'Activities': 'primary',      // Blue - consistent with main color
      'Other': 'secondary'          // Gray - neutral
    };
    return colors[category] || 'secondary';
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Expenses
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Expense
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MoneyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">
                  ${totalExpenses.toFixed(2)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Expenses
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1, color: '#10b981' }} />
                <Typography variant="h6" sx={{ color: '#10b981' }}>
                  ${perPersonShare.toFixed(2)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Per Person
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ mr: 1, color: '#f59e0b' }} />
                <Typography variant="h6" sx={{ color: '#f59e0b' }}>
                  +$25.50
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                You Owe
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingDownIcon sx={{ mr: 1, color: '#059669' }} />
                <Typography variant="h6" sx={{ color: '#059669' }}>
                  -$15.25
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                You're Owed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Expenses List */}
      <Paper>
        <List>
          {expenses.map((expense, index) => (
            <React.Fragment key={expense.id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <ReceiptIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">
                        {expense.title}
                      </Typography>
                      <Chip
                        label={expense.category}
                        color={getCategoryColor(expense.category)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Paid by {expense.paidBy} on {expense.date}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Split between {expense.splitBetween.length} people
                      </Typography>
                    </Box>
                  }
                />
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" color="primary">
                    ${expense.amount.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${(expense.amount / expense.splitBetween.length).toFixed(2)} each
                  </Typography>
                </Box>
              </ListItem>
              {index < expenses.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Add Expense Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Expense</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Expense Title"
            value={newExpense.title}
            onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Amount"
            type="number"
            inputProps={{ step: "0.01", min: "0" }}
            value={newExpense.amount}
            onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Category"
            select
            value={newExpense.category}
            onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
            sx={{ mb: 2 }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Paid By"
            select
            value={newExpense.paidBy}
            onChange={(e) => setNewExpense({...newExpense, paidBy: e.target.value})}
          >
            <MenuItem value="John Doe">John Doe</MenuItem>
            <MenuItem value="Jane Smith">Jane Smith</MenuItem>
            <MenuItem value="Mike Johnson">Mike Johnson</MenuItem>
            <MenuItem value="Sarah Wilson">Sarah Wilson</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddExpense} variant="contained">Add Expense</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Expenses;