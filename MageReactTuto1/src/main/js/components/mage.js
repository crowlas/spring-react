import {UpdateDialog, UpdateEquipementDialog} from './dialog';

const React = require('react');
const client = require('./../connection/client');

function getLink(json){
	return json.entity === undefined? json._links === undefined?
		json : json._links.self.href : json.entity._links.self.href;
}

class Mage extends React.Component{
	constructor(props) {
		super(props);
		
		this.state = {equipements: [], score:"Show prizes first", isLoaded: false}; // variables gloabal
		
		this.handleDelete = this.handleDelete.bind(this);
		this.searchEquipements = this.searchEquipements.bind(this);
		this.updateEquipements = this.updateEquipements.bind(this);
	}
	
	componentDidMount(){
		this.searchEquipements();
	}

	handleDelete() {
		this.props.onDelete(this.props.mage);
	}

	
	updateEquipements(updatedEquips){
		client({
			method: 'PATCH', 
			path: getLink(this.props.mage),
			entity: {"equipements":updatedEquips.map(equip => getLink(equip))},
			headers: {'Content-Type': 'application/json'}
		})
		.catch(err => alert(JSON.stringify(err)))
		.done(response => {
			this.searchEquipements();
		});
	}
	
	setStateEquipements(updatedEquips){
		this.setState({
			equipements: updatedEquips,
			isLoaded: true,
			score:updatedEquips.reduce((acc, e) => acc + e.vitality, 0)
		});
		this.props.updateAvailableEquipements();
	}
	
	searchEquipements() {
		client({method: 'GET', path: getLink(this.props.mage)+"/equipements"})
		.done(response => {
			this.setStateEquipements(response.entity._embedded.equipements);
		});
	}
	
	render() {
		const showOrUpdate = this.state.isLoaded? 
			<UpdateEquipementDialog key={'updateEquip_'+getLink(this.props.mage)} 
					mage={this.props.mage} attributes={this.props.attributes} 
					updateEquipements={this.updateEquipements} currentEquipements={this.state.equipements}
					availableEquipements={this.props.availableEquipements}/>
			: <button onClick={this.searchEquipements}>Show</button>
		return (
			<tr>
				<td>{this.props.mage.entity.name}</td>
				<td>{this.props.mage.entity.description}</td>
				<td>{this.state.score}</td>
				<td>
					<MageEquipements key={'equip_'+getLink(this.props.mage)} 
							isLoaded={this.state.isLoaded} equipements={this.state.equipements}/>
					{showOrUpdate}
				</td>
				<td>
					<UpdateDialog mage={this.props.mage} attributes={this.props.attributes}
							onUpdate={this.props.onUpdate}/>
					<button onClick={this.handleDelete}>Delete</button>
				</td>
			</tr>
		)
	}
}

class MageEquipements extends React.Component {
	render(){
		const equipements = this.props.isLoaded ? 
			this.props.equipements.length ? 		
				this.props.equipements.map(equip => 
					<div>
						<a href={'#equip'+getLink(equip)}>{equip.name}</a>
					</div>
				) 
				: "No prize" : "";	
		return (
			<div>{equipements}</div>
		);
	} 
}

export default Mage; // Don’t forget to use export default!