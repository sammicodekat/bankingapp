const App = React.createClass({
    getInitialState() {
        return {
          transactions: [],
          total :0,
          credit:'show',
          debit :'show',
          filter:'total'
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
    updateTotal(balance){
      const {total} =this.state;
      this.setState({
          total: total+balance
      })
    },

    removeTransaction(id,amount) {
        const {transactions,total} = this.state;
        this.setState({
            transactions: transactions.filter(transaction => transaction.id != id),
            total: total - amount
        });
    },
    showDebit(amount) {
        const {transactions} = this.state;
        this.setState({
            transactions: transactions.filter(transaction => transaction.amount < 0)
        });
    },
    showCredit(amount) {
        const {transactions} = this.state;
        this.setState({
            transactions: transactions.filter(transaction => transaction.amount > 0)
        });
    },

    render() {
        const {transactions,total} = this.state;
        return (
            <div className='well'>
                <h1>Banking App</h1>
                <div className="row">
                    <div className="col-md-4">
                        <label className="control-label" htmlFor="balance">Account Balance</label>
                        <h3 id="balance" ref ="balance">{total}</h3>
                    </div>
                    <div className="col-md-4">
                        <div className="pull-right">
                            <div className="btn-group">
                                <button type="button" className="btn btn-success btn-filter" onClick={this.showCredit} >Credit</button>
                                <button type="button" className="btn btn-danger btn-filter" onClick={this.showDebit}>Debit</button>
                                <button type="button" className="btn btn-warning btn-filter" data-target="pendiente">Total</button>
                            </div>
                        </div>
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
      search:''
    };
  }
  updateSearch(event){
   this.setState({search:event.target.value.substr(0,20)})
  }
    render() {
    const {transactions, removeTransaction,updateTotal} = this.props;
    let filtered = transactions.filter(
      (transaction) => {
        return transaction.description.indexOf(this.state.search) !== -1 ;
      }
    );
    return (
      <div>
        <div className="col-md-4">
        <div className="form-group">
            <label htmlFor="searchBar">Search:
            </label>
            <input id='searchBar' type='text' value={this.state.search} onChange ={this.updateSearch.bind(this)}/>
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
                    <tr key={transaction.id} className={transaction.shouldHide}>
                        <td>{transaction.description}</td>
                        <td>{transaction.amount}</td>
                        <td>{transaction.date}</td>
                        <td>
                            <button onClick={removeTransaction.bind(null, transaction.id,transaction.amount)} className="btn btn-sm btn-danger">X</button>
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
            shouldHide:'show'
        }
        this.props.addNewTransaction(transaction);
        this.props.updateTotal(am);
    },

    handleOptionChange: function(changeEvent) {
        this.setState({selectedOption: changeEvent.target.value});
    },

    render() {
        return (
            <form onSubmit ={this.submitForm}>
                <div className="row">
                    <div className="col-md-4">
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
                    <div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="newDescription">Description:
                            </label>
                            <input ref='description' type="text" className="form-control" id="newDescription" required/>
                        </div>
                    </div>
                    <div className="col-md-4 text-center">
                        <button className="btn btn-primary btn-block">Add</button>
                    </div>

                </div>
            </form>
        )
    }
})

ReactDOM.render(
    <App/>, document.getElementById('root'))
