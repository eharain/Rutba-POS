import Link from "next/link";
import Navigation from "./Navigation";
import NavigationSecondary from "./NavigationSecondary";
import SearchMenu from "./SearchMenu";
import FooterInfo from "./FooterInfo";

export default function Layout({ children }) {
    return (
        <div class="container mt-4">
            <div class="row">
                <Navigation />
                <NavigationSecondary></NavigationSecondary>
                <main className="col-md container py-3">{children}</main>


                <SearchMenu></SearchMenu>
                <FooterInfo />
            </div>
        </div>
    );
}
