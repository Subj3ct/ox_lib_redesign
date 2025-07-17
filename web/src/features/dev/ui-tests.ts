// UI Component Tests for ox_lib Redesign
// Use these commands in the browser console to test individual components

export const uiTests = {
  // Test Alert Dialog
  testAlert: () => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          action: 'showAlert',
          data: {
            header: 'Test Alert',
            content: 'This is a **test alert** with markdown support!\n\nDoes the glassmorphism look good?',
            centered: true,
            cancel: true,
            size: 'md'
          }
        }
      })
    );
  },

  // Test Input Dialog
  testInput: () => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          action: 'showInput',
          data: {
            heading: 'Test Input Dialog',
            rows: [
              {
                type: 'input',
                label: 'Username',
                placeholder: 'Enter your username...',
                required: true
              },
              {
                type: 'number',
                label: 'Age',
                placeholder: 'Enter your age...',
                min: 18,
                max: 100
              },
              {
                type: 'select',
                label: 'Role',
                options: [
                  { value: 'admin', label: 'Administrator' },
                  { value: 'user', label: 'User' },
                  { value: 'moderator', label: 'Moderator' }
                ]
              },
              {
                type: 'textarea',
                label: 'Bio',
                placeholder: 'Tell us about yourself...'
              }
            ]
          }
        }
      })
    );
  },

  // Test Context Menu
  testContext: () => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          action: 'showContext',
          data: {
            title: 'Test Context Menu',
            options: {
              option1: {
                description: 'First Option',
                icon: 'user',
                metadata: ['Info 1', 'Info 2']
              },
              option2: {
                description: 'Second Option',
                icon: 'cog',
                metadata: ['Settings']
              },
              option3: {
                description: 'Disabled Option',
                icon: 'ban',
                disabled: true
              },
              option4: {
                description: 'Action Option',
                icon: 'play',
                metadata: ['Execute action']
              }
            }
          }
        }
      })
    );
  },

  // Test List Menu
  testListMenu: () => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          action: 'showMenu',
          data: {
            title: 'Test List Menu',
            position: 'top-right',
            options: [
              {
                title: 'Option 1',
                description: 'First menu option',
                icon: 'home',
                metadata: ['Value: 100']
              },
              {
                title: 'Option 2',
                description: 'Second menu option with longer description text',
                icon: 'user',
                metadata: ['Players: 45/64']
              },
              {
                title: 'Disabled Option',
                description: 'This option is disabled',
                icon: 'ban',
                disabled: true
              },
              {
                title: 'Arrow Option',
                description: 'This has an arrow',
                icon: 'arrow-right',
                arrow: true
              }
            ]
          }
        }
      })
    );
  },

  // Test Radial Menu (already redesigned)
  testRadial: () => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          action: 'openRadialMenu',
          data: {
            items: [
              { icon: 'user', label: 'Profile' },
              { icon: 'cog', label: 'Settings' },
              { icon: 'home', label: 'Home' },
              { icon: 'car', label: 'Vehicle' },
              { icon: 'phone', label: 'Phone' },
              { icon: 'map', label: 'Map' },
              { icon: 'heart', label: 'Health' },
              { icon: 'shield', label: 'Police' },
              { icon: 'fire', label: 'Emergency' },
              { icon: 'wrench', label: 'Mechanic' }
            ]
          }
        }
      })
    );
  },

  // Test Notifications
  testNotifications: () => {
    // Success notification
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          action: 'notify',
          data: {
            type: 'success',
            title: 'Success!',
            description: 'This is a **success** notification with glassmorphism!',
            duration: 5000,
            position: 'top-right'
          }
        }
      })
    );

    // Error notification
    setTimeout(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: {
            action: 'notify',
            data: {
              type: 'error',
              title: 'Error!',
              description: 'Something went wrong...',
              duration: 5000,
              position: 'top-right'
            }
          }
        })
      );
    }, 1000);

    // Info notification
    setTimeout(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: {
            action: 'notify',
            data: {
              type: 'inform',
              title: 'Information',
              description: 'This is an informational message',
              duration: 5000,
              position: 'top-right'
            }
          }
        })
      );
    }, 2000);
  },

  // Test Progress Bar
  testProgress: () => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          action: 'progress',
          data: {
            label: 'Loading... Please wait',
            duration: 5000
          }
        }
      })
    );
  },

  // Test Circle Progress
  testCircleProgress: () => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          action: 'circleProgress',
          data: {
            duration: 3000,
            position: 'middle-right',
            label: 'Hacking...'
          }
        }
      })
    );
  },

  // Test Skill Check
  testSkillCheck: () => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          action: 'skillCheck',
          data: {
            difficulty: ['easy', 'medium', 'hard'],
            keys: ['W', 'A', 'S', 'D']
          }
        }
      })
    );
  },

  // Test TextUI
  testTextUI: () => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          action: 'showTextUI',
          data: {
            text: '[E] Interact\n[F] Secondary Action\n[G] Special Action',
            position: 'right-center',
            icon: 'hand-pointer'
          }
        }
      })
    );

    // Hide after 5 seconds
    setTimeout(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: {
            action: 'hideTextUI'
          }
        })
      );
    }, 5000);
  },

  // Test all components sequentially
  testAll: () => {
    console.log('🎨 Testing all UI components...');
    
    uiTests.testNotifications();
    
    setTimeout(() => uiTests.testTextUI(), 1000);
    setTimeout(() => uiTests.testProgress(), 2000);
    setTimeout(() => uiTests.testAlert(), 3000);
    setTimeout(() => uiTests.testContext(), 8000);
    setTimeout(() => uiTests.testListMenu(), 10000);
    setTimeout(() => uiTests.testRadial(), 12000);
    setTimeout(() => uiTests.testInput(), 15000);
    setTimeout(() => uiTests.testSkillCheck(), 18000);
    setTimeout(() => uiTests.testCircleProgress(), 20000);
  }
};

// Make tests available globally for easy browser console access
(window as any).uiTests = uiTests;

console.log('🎨 UI Tests loaded! Use uiTests.testAll() or individual test functions in the browser console.');
console.log('Available tests:', Object.keys(uiTests)); 