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
				<table>
					<tbody>
						<tr>
							<th>Name</th>
							<th>Vitality</th>
							<th></th>
							<th></th>
						</tr>
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
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleDelete() {
		this.props.onDelete(this.props.mage);
	}
	
	render() {
		return (
			<tr>
				<td>{this.props.mage.entity.name}</td>
				<td>{this.props.mage.entity.vitality}</td>
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
		const inputs = this.props.attributes.map(attribute =>
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