const React = require('react');
const ReactDOM = require('react-dom');


function getLink(json){
	return json.entity === undefined? json._links === undefined?
		json : json._links.self.href : json.entity._links.self.href;
}

class CreateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		const newMage = {};
		this.props.attributes.forEach(attribute => {
			newMage[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
		});
		this.props.onCreate(newMage);

		// clear out the dialog's inputs
		this.props.attributes.forEach(attribute => {
			ReactDOM.findDOMNode(this.refs[attribute]).value = '';
		});

		// Navigate away from the dialog to hide it.
		window.location = "#";
	}

	render() {
		const inputTextArea = this.props.attributes
		.filter(attribute => attribute=="description")
		.map(attribute =>
			<p key={attribute}>
				<label htmlFor={attribute} className="form-label">{attribute}</label>
				<textarea ref={attribute} className="form-control" rows="5"/>
			</p>
		);
		const inputsSimple = this.props.attributes
		.filter(attribute => attribute!="description")
		.map(attribute =>
			<p key={attribute}>
				<label htmlFor={attribute} className="form-label">{attribute}</label>
				<input type="text" ref={attribute} className="field form-control"/>
			</p>			
		);

		return (
			<div>
				<a href="#createMage">Create an article</a>

				<div id="createMage" className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>Create new article</h2>

						<form>
							{inputsSimple}
							{inputTextArea}
							<button onClick={this.handleSubmit}>Create</button>
						</form>
					</div>
				</div>
			</div>
		)
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
		
		this.toggleInCheckedEquip = this.toggleInCheckedEquip.bind(this);
		this.state = {
			linkMage : getLink(this.props.mage),
			currentEquipements : this.props.currentEquipements,
			checkedEquip : this.props.currentEquipements.map((x) => getLink(x))
		}
	}
	
	static getDerivedStateFromProps(props, current_state) {
		if (current_state.currentEquipements !== props.currentEquipements) {
	      return {
	        currentEquipements: props.currentEquipements,
	        checkedEquip: props.currentEquipements.map((x) => getLink(x))
	      }
	    }
	    return null
	}
	
	toggleInCheckedEquip(linkEquip){
		var equips = this.state.checkedEquip;
		var index = equips.indexOf(linkEquip);
		if(index===-1){
			equips.push(linkEquip);
		} else {
			equips.splice(index, 1);
		}
		this.setState({
			checkedEquip : equips
		});
	}

	handleSubmit(e) {
		e.preventDefault();
		this.props.updateEquipements(this.state.checkedEquip);
		window.location = "#";
	}

	render() {	
		const dialogId = "updateEquipements-" + this.state.linkMage;
		return (
			<div>
				<button><a className='updatePrizes' href={"#" + dialogId}>Update prizes</a></button>
				<div id={dialogId} className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>
						<h2>Give and retreive prizes</h2>

						<form>
							<CheckboxGroupEquipement key={'equipsAvailable'+this.state.linkMage} 
									toggleInCheckedEquip={this.toggleInCheckedEquip} title={"Prizes obtainables"}
									defaultChecked={false} equipements={this.props.availableEquipements}/>
							<CheckboxGroupEquipement key={'equipsCurrent'+this.state.linkMage} 
									toggleInCheckedEquip={this.toggleInCheckedEquip} title={"Already obtained prizes"}
									defaultChecked={true} equipements={this.state.currentEquipements}/>
									
							<button onClick={this.handleSubmit}>Update</button>
						</form>
					</div>
				</div>
			</div>
		)
	}

};

class CheckboxGroupEquipement extends React.Component {
	render() {
		const equipements = this.props.equipements.map(equip =>
			{ 
				const linkEquip = getLink(equip);
				return (
					<CheckboxEquipement key={linkEquip+this.props.linkMage} value={linkEquip} 
							toggleInCheckedEquip={this.props.toggleInCheckedEquip}
							defaultChecked={this.props.defaultChecked} title={equip.name}/>
				)
			});
		return(
			<div>
				<h5>{this.props.title}</h5>
				{equipements}
			</div>
		);	
	}
}

class CheckboxEquipement extends React.Component {
	constructor(props){
		super(props);
		this.handleToggleCheckbox = this.handleToggleCheckbox.bind(this);
	}
	
	handleToggleCheckbox(){
		this.props.toggleInCheckedEquip(this.props.value);		
	}
	
	render() {
		return(
			<div className='form-check'>
				<input className="form-check-input" type="checkbox" id={this.key} onClick={this.handleToggleCheckbox}
						defaultChecked={this.props.defaultChecked} value={this.props.value} />
				<label className="form-check-label" htmlFor={this.key}>{this.props.title}</label>
			</div>
		);	
	}
}


export {CreateDialog, UpdateDialog, UpdateEquipementDialog}; // Don’t forget to use export default!

