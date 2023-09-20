import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faWeightScale, faHouse } from '@fortawesome/free-solid-svg-icons';

export const IconLink = ({ to, icon, label }) => {
    return (
        <div className="w-1/2 text-center">
            <Link to={to} className="hover:underline flex flex-col items-center">
                <div>
                    <FontAwesomeIcon icon={icon} size="2x" />
                </div>
                <div className="text-xs mb-2">
                    {label}
                </div>
            </Link>
        </div>
    );
};
