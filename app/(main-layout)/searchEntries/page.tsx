import searchEntries from '@/app/actions/searchEntries';
import EntriesTable from '@/components/EntriesTable';
import getUserInfo from '@/lib/getUserInfo';
import ProjectButtons from '@/components/ProjectButtons';
import ProjectMetadata from '@/components/ProjectMetadata';

export default async function SearchEntries() {
  const searchQuery = 'Seuss';
  const {
    user,
    permissions: { isAdmin },
  } = await getUserInfo();

  if (user == undefined) {
    return 'Must be logged in to search';
  }

  const { entries, error } = await searchEntries(searchQuery, user.id);

  if (error) {
    return <div>Error: {error}</div>;
  }
  return <pre>{JSON.stringify(entries, null, 2)}</pre>;
  //   return (
  //     <>
  //       <h1 className="h2">{project?.title}</h1>
  //       {/* <p>Owner: {project?.user.name}</p> */}
  //       {project && <ProjectMetadata project={project} hideTitle={true} />}
  //       <div className={'mb-3'} id={'project-tools'}>
  //         <ProjectButtons
  //           projectId={parseInt(id)}
  //           canEdit={canEdit}
  //           canPrint={canPrint}
  //           canAssignCoEditors={isAdmin || isOwner}
  //           onPage="project"
  //         />
  //       </div>
  //       {bibEntries && bibEntries.data?.entries && user ? (
  //         <EntriesTable
  //           entries={bibEntries.data?.entries}
  //           canEdit={canEdit}
  //           canPrint={canPrint}
  //         />
  //       ) : (
  //         <p>No bibliography entries found.</p>
  //       )}
  //       <p className="mt-5">Notes: {project?.notes}</p>
  //       {process.env.NEXT_PUBLIC_IS_DEV_ENV && (
  //         <pre>{JSON.stringify(bibEntries.data?.entries, null, 2)}</pre>
  //       )}
  //     </>
  //   );
}
