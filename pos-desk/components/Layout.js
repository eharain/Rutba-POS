import Link from "next/link";
import Navigation from "./Navigation";
import NavigationSecondary from "./NavigationSecondary";
import SearchMenu from "./SearchMenu";
import FooterInfo from "./FooterInfo";

export default function Layout({ children }) {
    return (
        <div className="container mt-4">
            {/* Top navigation */}
            <Navigation />

            {/* Secondary navigation */}
            <NavigationSecondary />

            {/* Main content + side menu */}
            <div className="row">
                <main className="col-md-9 container py-3 bg-white">{children}</main>
                <aside className="col-md-3">
                    <SearchMenu />
                </aside>
            </div>

            {/* Footer */}
            <FooterInfo />
        </div>
    );
}