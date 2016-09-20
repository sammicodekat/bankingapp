const App = React.createClass({
    getInitialState() {
        return {
          transactions: [],
          filtered: [],
          total : 0,
          credits: 0,
          debits: 0
        }
    },

    addNewTransaction(newTransaction) {
        const {transactions} = this.state;
        this.setState({
            transactions: [
                ...transactions,
                newTransaction
            ]
        })
    },
    updateTotal(balance,option){
      const {total,debits,credits} =this.state;
      if(option ==="debit")
      {
        this.setState({
            debits: debits+balance,
            total: total+balance
        })
      }
      else
      {
        this.setState({
            credits: credits+balance,
            total: total+balance
        })
      }
    },

    removeTransaction(id,amount,type) {
        const {transactions,total,debits,credits} = this.state;
        this.setState({
            transactions: transactions.filter(transaction => transaction.id != id),
            total: total - amount
        })
        if (type == 'debit'){
          this.setState({
              debits: debits - amount
          })
        }
        else{
          this.setState({
              credits: credits - amount
          })
        }
    },

    render() {
        const {transactions,total,credits,debits} = this.state;
        return (
            <div className='well'>
                <h1>Banking App</h1>
                <div className="row">
                    <div className="col-xs-4 col-md-3">
                        <label className="control-label" htmlFor="balance">Account Balance</label>
                        <h3 id="balance" ref ="balance">{total}</h3>
                    </div>
                    <div className="col-xs-4 col-md-3">
                        <label className="control-label" htmlFor="cre">Total Credits</label>
                        <h3 id="cre" >{credits}</h3>
                    </div>
                    <div className="col-xs-4 col-md-3">
                        <label className="control-label" htmlFor="deb">Total Debits</label>
                        <h3 id="deb" >{debits}</h3>
                    </div>
                </div>
                <NewTransactionForm addNewTransaction={this.addNewTransaction} updateTotal={this.updateTotal}/>
                <TransactionTable transactions={transactions} removeTransaction={this.removeTransaction}/>
            </div>
        )
    }
})

class TransactionTable extends React.Component {
  constructor(){
    super();
    this.state ={
      search:'',
      credit:'show',
      debit:'show'
    };
  }

  updateSearch(event){
   this.setState({search:event.target.value.substr(0,20)})
 }

 showDebit() {
     const {credit,debit} = this.state;
     this.setState({
         credit:'hide',
         debit:'show'
     });
 }

 showCredit() {
     const {credit,debit} = this.state
     this.setState({
         credit:'show',
         debit:'hide'
     })
 }
 showTotal() {
     const {credit,debit} = this.state;
     this.setState({
         credit:'show',
         debit:'show'
     });
 }
    render() {
    const {transactions, removeTransaction,updateTotal,total} = this.props;
    const {credit,debit} =this.state;
    let sum =0;
    let filtered = transactions.filter(
      (transaction) => {
        return transaction.description.indexOf(this.state.search) !== -1 ;
      }
    );

    if(credit=='hide')
    {
      filtered = transactions.filter(
        (transaction) => {
          return transaction.amount < 0 ;
        })
    }

    if(debit=='hide')
    {
      filtered = transactions.filter(
        (transaction) => {
          return transaction.amount > 0 ;
        })
    }

    return (
      <div>
        <div className ="row search">
          <div className="col-xs-6 col-md-4">
              <div className="pull-left">
                  <div className="btn-group">
                      <button type="button" className="btn btn-success btn-filter" onClick={this.showCredit.bind(this)} >Credit</button>
                      <button type="button" className="btn btn-danger btn-filter" onClick={this.showDebit.bind(this)}>Debit</button>
                      <button type="button" className="btn btn-warning btn-filter" onClick={this.showTotal.bind(this)}>Total</button>
                  </div>
              </div>
          </div>
        <div className="col-xs-6 col-md-4">
        <div className="form-group pull-right">
            <label htmlFor="searchBar">Search:
            </label>
            <input id='searchBar' type='text' value={this.state.search} placeholder ="Search Description" onChange ={this.updateSearch.bind(this)}/>
        </div>
      </div>
    </div>
        <table className="table sortable table-hover">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {filtered.map(transaction => (
                    <tr key={transaction.id}>
                        <td>{transaction.description}</td>
                        <td>{transaction.amount}</td>
                        <td>{transaction.date}</td>
                        <td>
                            <button onClick={removeTransaction.bind(null, transaction.id,transaction.amount,transaction.type)} className="btn btn-sm btn-danger">X</button>
                        </td>
                    </tr>
                )
              )}
          </tbody>
        </table>
      </div>
    )
  }
}

const NewTransactionForm = React.createClass({
  getInitialState() {
      return {
        selectedOption: 'debit'
      }
  },
    submitForm(e) {
        e.preventDefault();
        let {description, amount} = this.refs;
        let am = parseFloat(amount.value);
        let {selectedOption} = this.state;
        if(selectedOption === 'debit'){
          am = -am;
        }
        let transaction = {
            amount: am,
            description: description.value,
            id: uuid(),
            date: moment().format('MMMM Do YYYY, h:mm:ss a'),
            type: selectedOption
        }
        this.props.addNewTransaction(transaction);
        this.props.updateTotal(am,selectedOption);
    },

    handleOptionChange: function(changeEvent) {
        this.setState({selectedOption: changeEvent.target.value});
    },

    render() {
        return (
            <form onSubmit ={this.submitForm}>
                <div className="row">
                    <div className="col-md-4 col-xs-6">
                        <div className="form-group">
                            <label className="control-label" htmlFor="newAmount">Amount</label>
                            <div className="input-group">
                                <input id="newAmount" ref="amount" className="form-control" placeholder="$1,000" type="number" min='0' step='0.1' required=""/>
                                <div className="input-group-btn">
                                    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                        Debit/Credit
                                        <span className="caret"></span>
                                    </button>
                                    <ul className="dropdown-menu pull-right">
                                        <li className="text-center">
                                            <label>
                                                <input type="radio" value="debit" checked={this.state.selectedOption === 'debit'} onChange={this.handleOptionChange}/>
                                                Debit
                                            </label>
                                        </li>
                                        <li className="text-center">
                                            <label>
                                                <input type="radio" value="credit" checked={this.state.selectedOption === 'credit'} onChange ={this.handleOptionChange}/>
                                                Credit
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-xs-6">
                        <div className="form-group">
                            <label htmlFor="newDescription">Description:
                            </label>
                            <input ref='description' type="text" className="form-control" id="newDescription" required/>
                        </div>
                    </div>
                    <div className="col-md-4 col-xs-12  text-center">
                        <button className="btn btn-primary btn-block">Add</button>
                    </div>

                </div>
            </form>
        )
    }
})

ReactDOM.render(
    <App/>, document.getElementById('root'))
