import { Column, PrimaryGeneratedColumn, Entity, BaseEntity, getConnection } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
export class Product extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: string;

    @Field(() => String)
    @Column()
    title: string;

    @Field(() => String)
    @Column()
    description: string;

    @Field(() => String)
    @Column()
    picture: string;

    @Field(() => Number)
    @Column()
    price: number;

    /**
     * Search products by title or description, case-insensitive.
     *
     * @param {string} term
     */
    static async search(term: string) {
        term = term.toLowerCase()
        const repo = getConnection().manager.getRepository(Product)
        return await repo
            .createQueryBuilder()
            .select()
            .where('lower(title) LIKE :term', { term: `%${term}%` })
            .orWhere('lower(description) LIKE :term', { term: `%${term}%` })
            .getMany();
    }
}