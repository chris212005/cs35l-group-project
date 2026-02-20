import PersonCard from './PersonCard';

export default function PeopleSection() {
    return (
        <div className="peopleSection">
            <h2>People you may know:</h2>

            <div className="peopleGrid">
                <PersonCard username="Jesse_Men" name="Jesse Mendez" />
                <PersonCard username="Angel_Ave" name="Angel Avelar"/>
                <PersonCard username="Alexis_Mor" name="Alexis Morelo"/>
            </div>
        </div>
    );
}