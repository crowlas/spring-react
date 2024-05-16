const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./../connection/client');

function getLink(json){
	return json.entity === undefined? json._links === undefined?
		json : json._links.self.href : json.entity._links.self.href;
}

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
			<Mage key={getLink(mage)} mage={mage} attributes={this.props.attributes} 
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

class Mage extends React.Component{
	constructor(props) {
		super(props);
		
		this.state = {equipements: [], score:"Show prizes first", isLoaded: false}; // variables gloabal
		
		this.handleDelete = this.handleDelete.bind(this);
		this.searchEquipements = this.searchEquipements.bind(this);
		this.updateEquipements = this.updateEquipements.bind(this);
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
	}
	
	searchEquipements() {
		//alert(JSON.stringify(getLink(this.props.mage)));
		client({method: 'GET', path: getLink(this.props.mage)+"/equipements"})
		.done(response => {
			//alert(JSON.stringify(response.entity._embedded.equipements));
			this.setStateEquipements(response.entity._embedded.equipements);
		});		
	}
	
	render() {
		
		const equipements = this.state.isLoaded ? 
			this.state.equipements.length ? 		
				this.state.equipements.map(equip => 
					<RefEquip key={getLink(equip)} equip={equip}/>) 
			: "No prize" : "";	
		const showOrUpdate = this.state.isLoaded? 
			<UpdateEquipementDialog key={'updateEquip_'+getLink(this.props.mage)} mage={this.props.mage} attributes={this.props.attributes} 
					updateEquipements={this.updateEquipements} currentEquipements={this.state.equipements}/>:
			<button onClick={this.searchEquipements}>Show</button>
		return (
			<tr>
				<td>{this.props.mage.entity.name}</td>
				<td>{this.props.mage.entity.description}</td>
				<td>{this.state.score}</td>
				<td>{equipements}{showOrUpdate}</td>
				<td>
					<UpdateDialog mage={this.props.mage}
								  attributes={this.props.attributes}
								  onUpdate={this.props.onUpdate}/>
					<button onClick={this.handleDelete}>Delete</button>
				</td>
			</tr>
		)
	}
}

class RefEquip extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render(){
		return (
			<>
			<a href={'#equip'+getLink(this.props.equip)}>{this.props.equip.name}</a>
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
		const inputTextArea = this.props.attributes
		.filter(attribute => attribute=="description")
		.map(attribute =>
			<p key={this.props.mage.entity[attribute]}>
				<label htmlFor={attribute} className="form-label">{attribute}</label>
				<textarea defaultValue={this.props.mage.entity[attribute]}
					   ref={attribute} className="form-control" rows="5"/>
			</p>
		);
		const inputsSimple = this.props.attributes
		.filter(attribute => attribute!="description")
		.map(attribute =>
			<p key={this.props.mage.entity[attribute]}>
				<label htmlFor={attribute} className="form-label">{attribute}</label>
				<input type="text" defaultValue={this.props.mage.entity[attribute]}
					   ref={attribute} className="field form-control"/>
			</p>			
		);

		const dialogId = "updateMage-" + getLink(this.props.mage);

		return (
			<div key={getLink(this.props.mage)}>
				<button><a href={"#" + dialogId}>Update</a></button>
				<div id={dialogId} className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>Update an article</h2>

						<form>
							{inputsSimple}
							{inputTextArea}
							<button onClick={this.handleSubmit}>Update</button>
						</form>
					</div>
				</div>
			</div>
		)
	}

};

class UpdateEquipementDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		
		this.state = {new_equipements:[]}; // variables global
	}

	handleSubmit(e) {
		e.preventDefault();
		const equips = [];
		this.state.new_equipements.forEach(equip => {
			const checkbox = document.getElementById(getLink(equip));
			if(checkbox.checked) {
				equips.push(checkbox.value.trim());
			}
		});
		this.props.currentEquipements.forEach(equip => {
			const checkbox = document.getElementById(getLink(equip));
			if(checkbox.checked) {
				equips.push(checkbox.value.trim());
			}
		});
		this.props.updateEquipements(equips);
		window.location = "#";
	}
	
	componentDidMount(){
		this.searchAvailableEquipements();
	}
	
	componentWillReceiveProps(){
		this.searchAvailableEquipements();
	}
	
	searchAvailableEquipements() {
		client({method: 'GET', path: "http://localhost:8080/api/equipements/search/findAllAvailable"})
		.done(response => {
			this.setState({
				new_equipements: response.entity._embedded.equipements
			});
			
		});		
	}

	render() {
		const currentEquipements = this.props.currentEquipements.map(equip =>
			<div className='form-check' key={getLink(equip)}>
				<input className="form-check-input" type="checkbox" defaultChecked value={getLink(equip)} id={getLink(equip)}/>
				<label className="form-check-label" htmlFor={getLink(equip)}>
					{equip.name}
				</label>
			</div>
		);
		const availablesEquipements = this.state.new_equipements.map(equip =>
			<div className='form-check' key={getLink(equip)}>
				<input className="form-check-input" type="checkbox" value={getLink(equip)} id={getLink(equip)}/>
				<label className="form-check-label" htmlFor={getLink(equip)}>
					{equip.name}
				</label>
			</div>
		);
		const dialogId = "updateEquipements-" + getLink(this.props.mage);

		return (
			<div key={getLink(this.props.mage)}>
				<button><a href={"#" + dialogId}>Update prizes</a></button>
				<div id={dialogId} className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>
						<h2>Give and retreive prizes</h2>

						<form>
							<div>
								<h5>Prizes obtainables</h5>
								{availablesEquipements}
							</div>
							<div>
								<h5>Already obtained prizes</h5>
								{currentEquipements}
							</div>
							<button onClick={this.handleSubmit}>Update</button>
						</form>
					</div>
				</div>
			</div>
		)
	}

};


export default MageList; // Don’t forget to use export default!