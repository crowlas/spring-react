const React = require('react');
const client = require('./../connection/client');

class AppEquipement extends React.Component {

	constructor(props) {
		super(props);
		this.state = {equipements: [], isHidden: true}; // variables gloabal
		this.handleToggleIsHidden = this.handleToggleIsHidden.bind(this);
		// this.searchEquipements = this.searchEquipements.bind(this); // not callable from outside
	}
	
	handleToggleIsHidden() {
		this.setState({isHidden: !this.state.isHidden});
		if(Object.keys(this.state.equipements).length === 0) {
			this.searchEquipements();
		}
	}
	
	searchEquipements() {
		client({method: 'GET', path: '/api/equipements'}).done(response => {
			this.setState({equipements: response.entity._embedded.equipements});
		});
	}
	
	render() {
		var list = this.state.isHidden? null : <EquipementList equipements={this.state.equipements}  />;
		return (
			<div>
                <h2>List of equipements</h2>
                <div>
                	<button onClick={this.handleToggleIsHidden}>
                		{Object.keys(this.state.equipements).length === 0 ? 'Search for equipements' : 'Toggle visibility' }
                	</button>
                </div>
                {list}          
            </div>
		)
	}
}

class EquipementList extends React.Component{
	render() {
		const equipements = this.props.equipements.map(equipement =>
			<Equipement key={equipement._links.self.href} equipement={equipement}/>
		);
		return (
			<table>
				<tbody>
					<tr>
						<th>Name</th>
						<th>Vitality</th>
					</tr>
					{equipements}
				</tbody>
			</table>
		)
	}
}

class Equipement extends React.Component{	
	render() {
		return (
			<tr>
				<td>{this.props.equipement.name}</td>
				<td>{this.props.equipement.vitality}</td>
			</tr>
		)
	}
}

export default AppEquipement; // Don’t forget to use export default!