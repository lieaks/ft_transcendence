import { Resolver, Query, Mutation } from '@nestjs/graphql';

@Resolver()
export class TestResolver {
    private love: boolean = true;

    @Query(() => String)
    ping(): string {
        return 'Pong !';
    }

    @Query(() => String)
    chirel(): string {
		if (this.love) {
			return 'Chirel le sang !';
		} else {
			return 'Chirel grosse pute !';
		}
    }

    @Mutation(() => Boolean)
    loveChirel(): boolean {
        this.love = true;
        return this.love;
    }

    @Mutation(() => Boolean)
    notLoveChirel(): boolean {
        this.love = false;
        return this.love;
    }
}
