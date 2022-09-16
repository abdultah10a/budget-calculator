import React, { useState, useEffect } from 'react';
import './App.css';
import ExpenseList from './components/ExpenseList';
import Alert from './components/Alert';
import ExpenseForm from './components/ExpenseForm';
import { v4 as uuidv4 } from 'uuid';


const initialExpenses = localStorage.getItem("expenses")
  ? JSON.parse(localStorage.getItem("expenses"))
  : [];

function App() {

//**************   state values   *****************/
// all expenses, add expenses

  // const result = useState(initialExpenses);
  // const expenses = result[0];
  // const setExpenses = result[1]
  // console.log(result[0]);
  // console.log(result[1]);
  // console.log(expenses);
  // console.log(setExpenses);
  const [expenses, setExpenses] = useState(initialExpenses);
  // console.log(expenses);
  // console.log(setExpenses);

//  single expense
  const [charge, setCharge] = useState('');

//  single amount
  const [amount, setAmount] = useState(''); 
  
//  single alert
const [alert, setAlert] = useState({show:false})

// edit
const [edit, setEdit] = useState(false);

// edit item
const [id, setId] = useState(0);

useEffect(() => {
  console.log('we called useEffect')
  localStorage.setItem("expenses", JSON.stringify(expenses));
}, [expenses]);

//*****************  functionality *********
  const handleCharge = e => {
   // console.log(`charge : ${e.target.value}`);
    setCharge(e.target.value)
  };

  const handleAmount = e => {
  //  console.log(`amount : ${e.target.value}`);
    setAmount(e.target.value)
  };

  const handleAlert = ({type, text}) => {
    setAlert({show:true, type, text});
    setTimeout(() => {
      setAlert({show:false})
    }, 10000)
  }

  const handleSubmit = e => {
    e.preventDefault();
    //console.log(charge, amount);
    if (charge !== '' && amount > 0) {
      if (edit) {
        let tempExpenses = expenses.map(item => {
          return item.id === id ? { ...item, charge, amount }
          : item;
        });
        setExpenses(tempExpenses);
        setEdit(false);
        handleAlert({ type:'success', text:'item edited' });
      } else {      
        const singleExpense = { id: uuidv4(), charge, amount };
        setExpenses([...expenses, singleExpense]);
        handleAlert({ type:'success', text:'item added' });
      }
      setCharge('');
      setAmount('');
    }
    else {
      // handle alert
      handleAlert({ 
        type: 'danger', 
        text: `charge can't be empty value and amount has to bigger than zero` });
  }
  };
  
  //  clear all items
  const clearItems = () => {
  // console.log('cleared all items');
    setExpenses([]);
    handleAlert({ type: 'danger', text: 'item deleted'});
  };

  // handle delete
  const handleDelete = id => {
  // console.log(`item deleted : ${id}`);
  let tempExpenses = expenses.filter(item => item.id !== id);
  // console.log(tempExpenses);
  setExpenses(tempExpenses);
  handleAlert({ type: 'danger', text: 'item deleted'});
  };

  // handle edit
  const handleEdit = id => {
  // console.log(`item editted : ${id}`);
  let expense = expenses.find(item => item.id === id);
  let {charge, amount} = expense;
  setCharge(charge);
  setAmount(amount);
  setEdit(true);
  setId(id)
  };

  return (
    <>
    {alert.show && <Alert type={alert.type} text={alert.text} />}
    <Alert />
    <h1>Budget Calculator</h1>
    <main className='App'>
    <ExpenseForm 
      charge={charge} 
      amount={amount} 
      handleAmount={handleAmount} 
      handleCharge={handleCharge}
      handleSubmit={handleSubmit}
      edit={edit} 
      />
    <ExpenseList 
      expenses={expenses} 
      handleDelete={handleDelete}
      handleEdit={handleEdit}
      clearItems={clearItems}
      />
    </main>
    <h1>
      total spendng : <span className='total'>
        $ {expenses.reduce((acc, curr) => {
          return (acc += parseInt(curr.amount));
        }, 0)}
      </span>
    </h1>

    </>
  );
}

export default App;
