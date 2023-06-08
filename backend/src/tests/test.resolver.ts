import { Resolver, Query, Mutation } from '@nestjs/graphql';

@Resolver()
export class TestResolver {
    private str: string = 'Chirel le sang !';

    @Query(() => String)
    ping(): string {
        return 'Pong !';
    }

    @Query(() => String)
    chirel(): string {
        return this.str;
    }

    @Mutation(() => String)
    loveChirel(): String {
        this.str = 'Chirel le sang !';
        return this.str;
    }

    @Mutation(() => String)
    notLoveChirel(): String {
        this.str = 'Chirel plus le sang !';
        return this.str;
    }
}
