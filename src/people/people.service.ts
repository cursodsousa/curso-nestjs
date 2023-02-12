import { Injectable } from '@nestjs/common';
import { Person, PersonUpdatingRequest } from './person'

@Injectable()
export class PeopleService {
    people: Person[] = []

    list() : Person[] {
        return this.people;
    }

    save(person: Person){
        this.people.push(person);
    }

    findById(id: number) : Person{
        return this.people.find(person => person.id == id)
    }

    update(id: number, updatingPerson: PersonUpdatingRequest){
        this.people.forEach(person => {
            if(id == person.id){
                person.name = updatingPerson.name;
            }
        })
    }

    delete(id: number){
        const newList = this.people.filter( person => person.id != id )
        this.people = newList;
    }

}
