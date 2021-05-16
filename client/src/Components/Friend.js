import './Friend.css'

const Friend = (props) => {
	return (
		<div className ="friend">
			<img src={props.profile_pic} className="friend_pic"/>
			<span className ="friend_username"> {props.username} </span>
		</div>
	)
}

export default Friend