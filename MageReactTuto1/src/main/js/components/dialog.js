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
	}

	handleSubmit(e) {
		e.preventDefault();
		const equips = [];
		this.props.currentEquipements.forEach(equip => {
			const checkbox = document.getElementById(getLink(equip));
			if(checkbox && checkbox.checked) {
				equips.push(checkbox.value.trim());
			}
		});
		this.props.availableEquipements.forEach(equip => {
			const checkbox = document.getElementById(getLink(equip)+getLink(this.props.mage));
			if(checkbox && checkbox.checked) {
				equips.push(checkbox.value.trim());
			}
		});
		this.props.updateEquipements(equips);
		window.location = "#";
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
		const newsEquipements = this.props.availableEquipements.map(equip =>
			<div className='form-check' key={getLink(equip)+getLink(this.props.mage)}>
				<input className="form-check-input" type="checkbox" value={getLink(equip)} id={getLink(equip)+getLink(this.props.mage)}/>
				<label className="form-check-label" htmlFor={getLink(equip)+getLink(this.props.mage)}>
					{equip.name}
				</label>
			</div>
		);
		const dialogId = "updateEquipements-" + getLink(this.props.mage);

		return (
			<div key={getLink(this.props.mage)}>
				<button><a className='updatePrizes' href={"#" + dialogId}>Update prizes</a></button>
				<div id={dialogId} className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>
						<h2>Give and retreive prizes</h2>

						<form>
							<div>
								<h5>Prizes obtainables</h5>
								{newsEquipements}
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


export {CreateDialog, UpdateDialog, UpdateEquipementDialog}; // Don’t forget to use export default!

