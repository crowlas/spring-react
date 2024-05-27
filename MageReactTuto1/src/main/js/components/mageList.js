import Mage from './Mage';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./../connection/client');

class MageList extends React.Component{
	constructor(props) {
		super(props);
		this.handleNavFirst = this.handleNavFirst.bind(this);
		this.handleNavPrev = this.handleNavPrev.bind(this);
		this.handleNavNext = this.handleNavNext.bind(this);
		this.handleNavLast = this.handleNavLast.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.handleInputText = this.handleInputText.bind(this);
		
		
		this.updateAvailableEquipements = this.updateAvailableEquipements.bind(this)
		this.state = {
			availableEquipements: this.updateAvailableEquipements()
		};
	}
	
	 updateAvailableEquipements(){
		client({method: 'GET', path: "/api/equipements/search/findAllAvailable"})
		.done(response => {
			this.setState({
				availableEquipements: response.entity._embedded.equipements
			})
		});
	}
	
	handleInput(e) {
		e.preventDefault();
		const pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
		if (/^[0-9]+$/.test(pageSize)) {
			this.props.updatePageSize(pageSize);
		} else {
			ReactDOM.findDOMNode(this.refs.pageSize).value =
				pageSize.substring(0, pageSize.length - 1);
		}
	}
	
	handleInputText(e) {
		e.preventDefault();
		const mageName = ReactDOM.findDOMNode(this.refs.mageName).value;
		this.props.updateMageName(mageName);
	}
	
	handleNavFirst(e){
		e.preventDefault();
		this.props.onNavigate(this.props.links.first.href);
	}
	
	handleNavPrev(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.prev.href);
	}
	
	handleNavNext(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.next.href);
	}
	
	handleNavLast(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.last.href);
	}
	
	render() {
		const mages = this.props.mages.map(mage =>
			<Mage key={mage.entity._links.self.href} mage={mage} attributes={this.props.attributes} 
					onUpdate={this.props.onUpdate} onDelete={this.props.onDelete}
					availableEquipements={this.state.availableEquipements} 
					updateAvailableEquipements={this.updateAvailableEquipements}/>
		);
	
		const navLinks = [];
		if ("first" in this.props.links) {
			navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
		}
		if ("prev" in this.props.links) {
			navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
		}
		if ("next" in this.props.links) {
			navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
		}
		if ("last" in this.props.links) {
			navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
		}
	
		return (
			<div>
				<p>
					<span>Number of results : </span>
					<input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}/>
				</p>
				<p>
					<span>Nom de l'article : </span>
					<input ref="mageName" defaultValue={this.props.mageName} onInput={this.handleInputText}/>
				</p>
				<table className="table table-bordered">
					<thead>
						<tr>
							<th>Name</th>
							<th>Description</th>
							<th>Score</th>
							<th>Prizes</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{mages}
					</tbody>
				</table>
				<div>
					{navLinks}
				</div>
			</div>
			)
		}
}


export default MageList; // Don’t forget to use export default!