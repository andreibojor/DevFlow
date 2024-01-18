import React from 'react';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import LocalSearchbar from '@/components/shared/search/local-searchbar';
import { UserFilters } from '@/constants/filters';
import Filter from '@/components/shared/filter';
import UserCard from '@/components/cards/user-card';
import { getAllUsers } from '@/lib/actions/user.action';
import Link from 'next/link';

const CommunityPage = async () => {
  const { userId } = auth();

  if (!userId) redirect('/sign-in');

  const { users } = await getAllUsers({});

  //   console.log(users);

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>All Users</h1>
      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <LocalSearchbar
          route='/community'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          placeholder='Search by username...'
          otherClasses='flex-1'
        />

        <Filter
          filters={UserFilters}
          otherClasses='min-h-[56px] sm:min-w-[170px]'
          containerClasses='flex'
        />
      </div>

      <section className='mt-12 flex flex-wrap gap-4'>
        {users.length > 0 ? (
          users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className='paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center'>
            <p>No users yet</p>
            <Link href='/sign-up' className='mt-2 font-bold text-accent-blue'>
              Join to be the first!
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default CommunityPage;