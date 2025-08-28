import Link from "next/link";
import FooterInfo from "./FooterInfo";
import Navigation from "./Navigation";
import NavigationSecondary from "./NavigationSecondary";


export default function Layout({ children }) {
    return (
        <div>
            <Navigation />
            <NavigationSecondary></NavigationSecondary>
            <main className="container py-3">{children}</main>
            <FooterInfo />
        </div>
    );
}
