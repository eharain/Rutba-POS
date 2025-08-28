
import Link from "next/link";

export default function NavigationSecondary() {

	//{/* Secondary Navigation */ }
	return (
		<nav className="navbar navbar-expand navbar-light bg-light px-3 py-1 border-bottom">
			<ul className="navbar-nav">
				<li className="nav-item">
					<Link className="nav-link" href="/new/sale">New Sale</Link>
				</li>
				<li className="nav-item">
					<Link className="nav-link" href="/new/return">New Return</Link>
				</li>
				<li className="nav-item">
					<Link className="nav-link" href="/New Purchase">New Purchase</Link>
				</li>
			</ul>

		</nav>
	)

}