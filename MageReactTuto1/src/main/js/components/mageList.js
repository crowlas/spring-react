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
					onUpdate={this.props.onUpdate} onDelete={this.props.onDelete}/>
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
				<table className="table table-bordered">
					<thead>
						<tr>
							<th>Name</th>
							<th>Vitality</th>
							<th>Equipement</th>
							<th></th>
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

class Mage extends React.Component{
	constructor(props) {
		super(props);
		
		this.state = {equipements: [], isLoaded: false}; // variables gloabal
		
		this.handleDelete = this.handleDelete.bind(this);
		this.searchEquipements = this.searchEquipements.bind(this);
		this.removeEquipement = this.removeEquipement.bind(this);
		
	}

	handleDelete() {
		this.props.onDelete(this.props.mage);
	}
	
	removeEquipement(equipement) {		
		const updatedEquips =  this.state.equipements.filter(
			f => f._links.self.href != equipement._links.self.href);
		this.setEquipements(updatedEquips);
	}
	
	addEquipement(equipement) {	
		const updatedEquips = this.state.equipements.push(equipement);	
		this.setEquipements(updatedEquips);
	}
	
	setEquipements(updatedEquips){
		client({
			method: 'PATCH', 
			path: this.props.mage.entity._links.self.href,
			entity: {"equipements":updatedEquips.map(equip => equip._links.self.href)},
			headers: {'Content-Type': 'application/json'}
		})
		.catch(err => alert(JSON.stringify(err.cause.message)))
		.done(response => {
			this.setState({
				equipements: updatedEquips,
			});
		});
	}
	
	searchEquipements() {
		//alert(JSON.stringify(this.props.mage.entity._links.self.href));
		client({method: 'GET', path: this.props.mage.entity._links.self.href+"/equipements"})
		.done(response => {
			//alert(JSON.stringify(response.entity._embedded.equipements));
			this.setState({
				equipements: response.entity._embedded.equipements,
				isLoaded: true
				});
		});
		
	}
	
	render() {
		
		const equipements = this.state.isLoaded ? 
			this.state.equipements.length ? 		
				this.state.equipements.map(equip => 
					<RefEquip key={equip._links.self.href} equip={equip} 
						removeEquip={this.removeEquipement}/>) 
			: "No equipements" : "";	
		const showOrAdd = this.state.isLoaded? <button >Add</button>:
			<button onClick={this.searchEquipements}>Show</button>
		return (
			<tr>
				<td>{this.props.mage.entity.name}</td>
				<td>{this.props.mage.entity.vitality}</td>
				<td>{equipements}{showOrAdd}</td>
				<td>
					<UpdateDialog mage={this.props.mage}
								  attributes={this.props.attributes}
								  onUpdate={this.props.onUpdate}/>
				</td>
				<td>
					<button onClick={this.handleDelete}>Delete</button>
				</td>
			</tr>
		)
	}
}

class RefEquip extends React.Component {
	constructor(props) {
		super(props);
		this.removeEquip = this.removeEquip.bind(this);
	}
	
	removeEquip() {
		this.props.removeEquip(this.props.equip);
	}
	
	render(){
		return (
			<>
			<a href={'#equip'+this.props.equip._links.self.href}>{this.props.equip.name}</a>
			<button onClick={this.removeEquip}>Remove</button>
			<br/>
			</>
		);
	} 
}

class UpdateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		const updatedMage = {};
		this.props.attributes.forEach(attribute => {
			updatedMage[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
		});
		this.props.onUpdate(this.props.mage, updatedMage);
		window.location = "#";
	}

	render() {
		const inputs = this.props.attributes
		.map(attribute =>
			<p key={this.props.mage.entity[attribute]}>
				<input type="text" placeholder={attribute}
					   defaultValue={this.props.mage.entity[attribute]}
					   ref={attribute} className="field"/>
			</p>
		);

		const dialogId = "updateMage-" + this.props.mage.entity._links.self.href;

		return (
			<div key={this.props.mage.entity._links.self.href}>
				<a href={"#" + dialogId}>Update</a>
				<div id={dialogId} className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>Update an mage</h2>

						<form>
							{inputs}
							<button onClick={this.handleSubmit}>Update</button>
						</form>
					</div>
				</div>
			</div>
		)
	}

};

export default MageList; // Don’t forget to use export default!